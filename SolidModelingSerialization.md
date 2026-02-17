---
title: Solid Modeling Serialization
description: Research on `UnionOperation`s/`IntersectOperation`s and how they are serialized
category: Documentation
tags: [Documentation, Solid Modeling, CSG, UnionOperation, IntersectOperation]
authors:
    - Captian-obvious (aka Superduperdev2)
---

# Research on `UnionOperation`s/`IntersectOperation`s and how they are serialized

**brought to you by Superduperdev2**

## Introduction
This document is based on information gained from:
1. `UnionOperation` behavior in Roblox Studio (saving as `rbxm`/`rbxmx`)
2. Analyzing uploaded assets containing `UnionOperation`s (gained from a game I own, Insert Wars Remastered)
3. Observing output from the "Superduperdev2 Insert Webservice"/"Insert Cloud" API (the JSON)
4. Analyzing (in a hex editor) specific `rbxm` files (mainly to confirm/disprove theories)

Research was done over multiple weeks, and this document is a summary of findings.<br/>
It is not 100% complete nor final as Roblox could change it at any time,<br/>
but should give a good idea of how `UnionOperation`s/`IntersectOperation`s <br/>
are currently serialized.<br/>
## Some context:
`UnionOperation`s are a form of Solid Modeling, in our case, used by Roblox and its AssetDelivery system;
They are what is refered to as Constructive Solid Geometry (CSG), fancy words saying "is made of multiple different parts".<br/>
Each one has `MeshData`, `PhysicsData`, and `ChildData`, all of which are used by the engine to render, simulate, and "Seperate" the object.<br/>
For quite a while it was thought they stored a custom format containing all parts,<br/>
including an operation tree, physics info, and mesh data, but new research (i.e. this documentation)<br/>
suggests its a lot simpler than that.

## What was discovered:
`UnionOperation`s are stored in an interesting, but insanely easy to replicate way.<br/>
Each `UnionOperation` *if its uploaded, whether as part of a place or model* has a hidden `AssetId`<br/>
property that points to a `PartOperationAsset`, with 2 sets of data:
1. `MeshData` (A **BinaryString** containing XOR encrypted `CSGMDL` data {*irrelavent to reconstruction*})<br/>
2. `ChildData` (***URIKA!*** An **RBXM  blob** containing all of the `BasePart`s used to make the mesh)<br/>
*Note: The `PartOperationAsset` may also contain additional properties, but they are not relevant to this documentation*<br/>

the `ChildData` property of the `PartOperationAsset` instance is a **RBXM blob**, and is parsed<br/>
identically to a normal RBXM file.<br/>
Therefore, you can reconstruct `UnionOperation`s with relative ease.<br/>
*IF you fetch the asset which is not stored as the `AssetType` **Model** but instead as **SolidModel***<br/>
Do note there are additional properties for the `UnionOperation`/`IntersectOperation` <br/>
called `MeshData2` and `ChildData2` that can contain the following: <br/>
1. *weirdly* `CSGPHS` data (PhysicsData?, Possibly caused by `PROP` chunk corruption or a bad parse)
2. Their respective RBXM/mesh blobs
3. An **RBXM blob** identical to `ChildData`
4. Empty/Null data<br/>

When these are present, the other `ChildData` and `MeshData` properties of<br/>
the `UnionOperation` will be empty, but `ChildData2` is parsed identically to `ChildData`<br/>
unless it contains `CSGPHS` data. As for the `UnionOperation`/`IntersectOperation` itself<br/>
it appears to encode a secondary set of data called `PhysicsData`/`PhysicalConfigData`<br/>
that starts with the bytes `CSGPHS` and is likely the collision data for the mesh.<br/>
Also, from what was observed the `PartOperationAsset` stores the **unscaled** mesh.<br/>
As such you have to apply the rest of the (`UnionOperation`/`IntersectOperation`) properties to<br/>
make it work. When not uploaded it appears to store these properties directly.<br/>
This is also **recursive**, so some of these also encode additional `UnionOperation`s/`IntersectOperation`s<br/>
that need to be handled in the same way. This is from limited testing and may not be accurate<br/> 
for all versions of Roblox's CSG, but its a starting point. There are a few ways this can be implemented,<br/>
but the way this spec would suggest doing so is a little complex but not too difficult.<br/>
When you encounter a `UnionOperation`/`IntersectOperation` in an RBXM parser,<br/>
look for the above properties. For `AssetId`, fetch the `PartOperationAsset` first, then<br/>
parse the `ChildData`/`ChildData2` property (whichever is present) as an RBXM file.<br/>
In the case the `ChildData`/`ChildData2` is present directly, just parse it as an RBXM file.<br/>
As already mentioned, this is **recursive**, so you may have to do this multiple times.<br/>
**In both cases, this will yield the `BasePart`s used to create the mesh.**<br/>
You can then use `GeometryService` calls or `BasePart` CSG API calls to recreate <br/>
the `UnionOperation`/`IntersectOperation`.
### IMPORTANT:
With this method the pivot will not always be in the correct spot. As such, you will have to adjust<br/>
it manually. This is because the `ChildData` only contains the raw `BasePart`s (with their *own* <br/> **relative** transforms), and not the `UnionOperation` transform data. You can calculate the correct pivot<br/>
by averaging the positions of all the `BasePart`s used to create it, or make a temporary model and use<br/>
the center of its bounding box *as shown below*.<br/>

```lua
function centerUnionPivot(union,parent)
    local tempModel = Instance.new("Model");
    union.Parent = tempModel;
    tempModel.PrimaryPart = union;
    local boxCFrame,_=tempModel:GetBoundingBox();
    local centeredPart=Instance.new("Part",parent);
    centeredPart.Size=Vector3.new(0,0,0);
    centeredPart.CFrame=boxCFrame;
    if (union.ClassName=="PartOperation") then --this is because GeometryService doesn't like mixed classnames, for some reason
        local new=mod.Services.GeometryService:UnionAsync(centeredPart,{union},options)[1];
        union:SubstituteGeometry(new);
        new:Destroy();
    elseif union:IsA("BasePart") then
        local new=centeredPart:UnionAsync({union},options.CollisionFidelity,options.RenderFidelity);
        union:SubstituteGeometry(new);
        new:Destroy();
    end;
    union.Parent=parent;
end;
```
This is not perfect, but it will get you close enough for most use cases. <br/>
You may need to tweak it further depending on your needs.

## An Interesting edge case: `AssetData` <br/>
In some cases, the `UnionOperation` may not have an `AssetId` property,<br/>
but instead have an `AssetData` property, which is a **BinaryString**.<br/>
Decoding this string will yield a binary blob that is identical to blob of<br/>
the `PartOperationAsset` mentioned earlier. This is likely used for<br/> 
smaller `UnionOperation`s that don't need to be uploaded separately.<br/>
as they can be stored directly within the `UnionOperation`s itself.<br/>
You can parse this blob in the same way as the `PartOperationAsset`.<br/>
This is not common, nor often, but still something to be aware of <br/>
when reconstructing `UnionOperation`s/`IntersectOperation`s.<br/>
## Reconstruction Guide
In order to reconstruct `UnionOperation`s/`IntersectOperation`s, you must first make sure they don't already have the `ChildData`/`ChildData2` stored directly. If they do, parse that and continue from there.<br/>
If it doesn't, Look for the `AssetId` property, Once you have found an `AssetId` property (usually they will have at least one of these),<br/>
Fetch it from the asset storage and parse it. You will end up with a `PartOperationAsset` that has both of the required properties.<br/>
The `PartOperationAsset`'s `ChildData` is an **RBXM blob** and contains the parts used to construct<br/>
the **unscaled** mesh, this is what you are after.<br/>
Parse the blob and you will have 1 of 3 things happen: 
1. It will just be directly all the parts used, and can be reconnected via `GeometryService:UnionAsync()` or `BasePart:UnionAsync()`
2. It will contain additonal `UnionOperation`s that you must recurse and parse.
3. It will contain `NegateOperation`s that have to be converted into `BasePart`s/`UnionOperation`s <br/>
and added to the root `UnionOperation` via `GeometryService:SubtractAsync()` or `BasePart:SubtractAsync()`

Once you have reached the bottom of the tree, start to climb back up it using various operations.
Most of the time, this includes a bunch of `GeometryService:UnionAsync()` or `BasePart:UnionAsync()` calls, and the occasional<br/>
`GeometryService:SubtractAsync()` or `BasePart:SubtractAsync()` call.<br/>
However, `IntersectOperation`s are special,<br/>
While they (`IntersectOperation`s) are stored identically to `UnionOperation`s<br/>
they are **created** with `GeometryService:IntersectAsync()` or `BasePart:IntersectAsync()` as opposed to the other calls.<br/>
Also it seems that Roblox treats `IntersectOperation`s differently internally,<br/>
as they have different behavior when it comes to physics and rendering.<br/>
*ie. they don't render the same way as `UnionOperation`s, and have different collision behavior*<br/>
Roblox Studio also creates `IntersectOperation`s in a strange way where it intersects all selected<br/> `BasePart`s first, then intersects the result with the first selected `BasePart`.<br/>
(lines up with observations). As such, simply looking at the classname and checking<br/>
if its an `IntersectOperation` or not, you can reliably determine if you need to adjust<br/>
the pipeline to accomodate these differences. Although it will take some trial and error,<br/>
you now can reliably create `UnionOperation`s from their RBXM/RBXMX data.

*note: the below code is from my implementation of this, available in [UnionOperation.lua](../module/Dependancies/UnionOperation.lua)*

```lua
function mod:applyChildData(childData,isIntersection)
    local suc,res=pcall(function()
        local response=self.Services.HttpService:RequestAsync({
            Url=self.parseUrl,
            Method="POST",
            Headers={
                ["Accept"]="application/json",
            },
            Body=childData,
        });
        if response.Success then
            return self.modules.json.decode(response.Body);
        else
            return error("Could not fetch. Request Error: "..response.StatusMessage.." ("..tostring(response.StatusCode)..")\nWhat went wrong:\n"..response.Body);
        end;
    end);
    if not suc then
        warn("Failed to get data: "..res);
    else
        print_if_debug(res);
        local model=self.modules.modelAssembler:buildAsset({modelData=res},self.Services.ReplicatedStorage);
        local function reconstruct(model)
            local partToAttachTo=nil;
            local theparts=model:GetChildren();
            local negativeParts={};
            local parts={};
            if #theparts<1 then
                warn("Model has no children to union.");
                return nil;
            end;
            partToAttachTo=theparts[1];
            if partToAttachTo:GetAttribute("IsNegateOperation") then --fix orientation issues
                print_if_debug("found");
                table.insert(negativeParts,partToAttachTo);
                local old=partToAttachTo;
                partToAttachTo=Instance.new("Part");
                partToAttachTo.Parent=model;
                partToAttachTo.Size=Vector3.new(0,0,0);
                partToAttachTo.CFrame=CFrame.new(old.CFrame.Position);
                partToAttachTo.Anchored=old.Anchored;
                partToAttachTo.Transparency=1;
                partToAttachTo.CanCollide=false;
                partToAttachTo.Name="UnionBasePart";
            end;
            for i,v in pairs(model:GetChildren()) do
                if v:IsA("BasePart") then
                    if v~=partToAttachTo then
                        if v:GetAttribute("IsNegateOperation") then
                            print_if_debug("found");
                            table.insert(negativeParts,v);
                        else
                            table.insert(parts,v);
                        end;
                    end;
                end;
            end;
            local old=partToAttachTo;
            local suc,Union=pcall(function()
                if isIntersection then
                    partToAttachTo=partToAttachTo:IntersectAsync(parts,options.CollisionFidelity,options.RenderFidelity);
                    partToAttachTo.Parent=self.Services.ReplicatedStorage;
                    partToAttachTo=partToAttachTo:IntersectAsync({old},options.CollisionFidelity,options.RenderFidelity); -- this is odd but fixes the problems
                    partToAttachTo.Parent=self.Services.ReplicatedStorage;
                    partToAttachTo:SetAttribute("IsNegateOperation", old:GetAttribute("IsNegateOperation"));
                    centerUnionPivot(partToAttachTo,partToAttachTo.Parent);
                    old:Destroy();
                    return partToAttachTo;
                end;
                print_if_debug(parts);
                if #parts>0 then
                    partToAttachTo=partToAttachTo:UnionAsync(parts,options.CollisionFidelity,options.RenderFidelity);
                    partToAttachTo.Parent=model;
                    partToAttachTo:SetAttribute("IsNegateOperation", old:GetAttribute("IsNegateOperation"));
                    old:Destroy();
                end;
                old=partToAttachTo;
                print_if_debug(negativeParts);
                if #negativeParts>0 then
                    partToAttachTo=partToAttachTo:SubtractAsync(negativeParts,options.CollisionFidelity,options.RenderFidelity);
                    partToAttachTo.Parent=self.Services.ReplicatedStorage;
                    partToAttachTo:SetAttribute("IsNegateOperation", old:GetAttribute("IsNegateOperation"));
                    old:Destroy();
                end;
                centerUnionPivot(partToAttachTo,partToAttachTo.Parent);
                return partToAttachTo;
            end);
            if not suc then
                warn("Union operation failed: "..tostring(Union));
                return nil;
            end;
            for i,v in pairs(parts) do
                v:Destroy();
            end;
            for i,v in pairs(negativeParts) do
                v:Destroy();
            end;
            model:Destroy();
            return partToAttachTo;
        end;
        return reconstruct(model);
    end;
end;
```

And thats pretty much it! <br/>
You can now reconstruct `UnionOperation`s/`IntersectOperation`s from their serialized properties! <br/>
Happy coding!

## Final notes
All findings were gained from studying `.rbxm` files in multiple ways, at no point was any software disassembled or dumped. However there is a few other notes worthy to mention:
- This spec file is purely observatory, it is not affiliated with or endorsed by Roblox Corporation.
- All findings can be traced to different parts of the document.
- Roblox could change this at any time, when that happens this spec file will be updated with new findings.

Credits for this document are provided below:
- Superduperdev2 (Research, Spec file, and Code)
- SIWeb Network (specifically the Insert Webservice, where uploaded assets were analyzed from)
- Multiple other helpers (josejr0322,servertechnology)
