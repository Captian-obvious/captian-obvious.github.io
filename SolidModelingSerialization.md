# Research on `UnionOperation`s/`IntersectOperation`s and how they are serialized
**brought to you by Superduperdev2**

## Introduction
This document is based on information gained from:
1. `UnionOperation` behavior in Roblox Studio (saving as `rbxm`/`rbxmx`)
2. Analyzing uploaded assets containing `UnionOperation`s (gained from a game I own, Insert Wars Remastered)
3. Observing output from the "Superduperdev2 Insert Webservice"/"Insert Cloud" API (the JSON)
4. Analyzing (in a hex editor) specific `rbxm` files (mainly to confirm/disprove theories)

## Some context:
`UnionOperation`s are a form of Solid Modeling, in our case, used by Roblox and its AssetDelivery system;
They are what is refered to as Constructive Solid Geometry (CSG), fancy words saying "is made of multiple different parts".<br/>
Each one has MeshData, PhysicsData and ChildData, all of which are used by the engine to render, simulate, and construct the object.<br/>
For quite a while we all thought they stored a custom format containing all parts,<br/>
including a operation tree, physics info, and mesh data, but new research (i.e. this documentation)<br/>
suggests its a lot simpler than that.

## What was discovered:
`UnionOperation`s are stored in an interesting, but insanely easy to replicate way.<br/>
Each `UnionOperation` *if its uploaded, whether as part of a place or model* has an AssetId property that is not visible outside of apis,<br/>
that points to a `PartOperationAsset`, with 2 datas:
1. MeshData (useless to us)
2. ChildData (***URIKA!*** An **RBXM  blob** containing all the solid parts used to make the mesh)
---

the ChildData property of the `PartOperationAsset` instance is parsed the exact same way as the root model is. *its just an RBXM*<br/>
Therefore, we can reconstruct `UnionOperation`s with relative ease.<br/>
*assuming you can get the asset itself which is not stored as **Model** but as **SolidModel** (*`AssetType`*)*<br/>
as to whats in MeshData, XOR encrypted CSGMDL data<br/>
*basically a mesh*<br/>
Do note there are things called MeshData2 and ChildData2 that can either contain PhysicsData OR an **RBXM blob**,<br/>
these would be parsed identically to ChildData in that case<br/>
the `UnionOperation`/`IntersectOperation` itself<br/>
appears to encode a secondary set of data called "PhysicsData".<br/>
Also, from what I've observed this `PartOperationAsset` stores the **unscaled** mesh.<br/>
you have to apply the rest of the (`UnionOperation`/`IntersectOperation`) properties to make it work.<br/>
When not uploaded it appears to store these properties directly.<br/>
Do note this is **recursive**, so some of these also encode additional `UnionOperation`s/`IntersectOperation`s that need to be handled in the same way.<br/>
This is from limited testing and may not be accurate for all versions of CSG, but its a starting point.<br/>
There are many ways this can be implemented, but the way I would suggest doing so is a little complex but not too difficult.<br/>
You can write an RBXM parser in Lua, and when you encounter a `UnionOperation`/`IntersectOperation`, whether in the Lua parser,<br/>
or an external one, look for the above properties, and if they are present parse them as such.<br/>
**IMPORTANT**:<br/>
With this method the pivot will not always be in the correct spot, you will have to adjust it manually.<br/>
This is because the ChildData only contains the raw parts (with their *own* transforms), and not the `UnionOperation`/`IntersectOperation` transform data.<br/>
You can calculate the correct pivot by averaging the positions of all the parts used to create it,<br/>
or make a temporary model and use the center of its bounding box *shown below*.<br/>
```lua
function centerUnionPivot(union,parent)
    if union:IsA("PartOperation") then
        local tempModel = Instance.new("Model");
        union.Parent = tempModel;
        tempModel.PrimaryPart = union;
        local boxCFrame,_=tempModel:GetBoundingBox();
        local centeredPart=Instance.new("Part",parent);
        centeredPart.Size=Vector3.new(0,0,0);
        centeredPart.CFrame=boxCFrame;
        local new=mod.Services.GeometryService:UnionAsync(centeredPart,{union},options)[1];
        union:SubstituteGeometry(new);
        new:Destroy();
    end;
    union.Parent=parent;
end;
```
This is not perfect, but it will get you close enough for most use cases. <br/>
You may need to tweak it further depending on your needs.

## An Interesting edge case: `AssetData` <br/>
In some cases, the `UnionOperation`/`IntersectOperation` may not have an AssetId property,<br/>
but instead have an `AssetData` property, which is a BinaryString.<br/>
Decoding this string will give you a binary blob that is identical to blob of
the `PartOperationAsset` mentioned earlier.<br/>
This is likely used for smaller `UnionOperation`s/`IntersectOperation`s that don't need to be uploaded separately.<br/>
as they can be stored directly within the `UnionOperation`/`IntersectOperation` itself.<br/>
You can parse this blob in the same way as the `PartOperationAsset`.<br/>
This is less common, but still something to be aware of when reconstructing `UnionOperation`s/`IntersectOperation`s.
## Reconstruction Guide
In order to reconstruct `UnionOperation`s/`IntersectOperation`s, you must first make sure they don't already have the ChildData stored directly. If they do, parse that and continue from there.<br/>
If it doesn't, Look for the AssetId property, Once you have confirmed they have an AssetId property (usually they will have at least one of these),<br/>
Fetch it from the asset storage and parse it. You will end up with a `PartOperationAsset` that has both of the required properties.<br/>
ChildData is an **RBXM blob** and contains the parts used to construct the **unscaled** mesh, <br/>
this is what we are after. Parse the blob and you will have 1 of 3 things happen: 
1. It will just be directly all the parts used, and can be reconnected via `GeometryService:UnionAsync()` or `BasePart:UnionAsync()`
2. It will contain additonal `UnionOperation`s that you must recurse and parse.
3. It will contain `NegateOperation`s that have to be converted into `BasePart`s/`UnionOperation`s <br/>
and added to the root `UnionOperation` via `GeometryService:SubtractAsync()` or `BasePart:SubtractAsync()`

Once we have reached the bottom of the tree, we can climb back up it using various operations.
Most of the time, this includes a bunch of `GeometryService:UnionAsync()` or `BasePart:UnionAsync()` calls, and the occasional<br/>
`GeometryService:SubtractAsync()` or `BasePart:SubtractAsync()` call.<br/>
However, `IntersectOperation`s are special,<br/>
While they (`IntersectOperation`s) are stored identically to `UnionOperation`s<br/>
they are **created** with `GeometryService:IntersectAsync()` or `BasePart:IntersectAsync()` as opposed to the other calls.<br/>
Also it seems that Roblox treats `IntersectOperation`s differently internally,<br/>
as they have different behavior when it comes to physics and rendering.<br/>
*ie. they don't render the same way as `UnionOperation`s, and have different collision behavior*<br/>
Roblox Studio also creates `IntersectOperation`s in a strange way where it intersects all parts first,<br/>
then intersects the result with the base part. (lines up with my testing)<br/>
Simply by looking at the classname and seeing if its an `IntersectOperation` or not,<br/>
we can reliably determine if we need to adjust the pipeline to accomodate these differences.<br/>
Although it will take some trial and error, you now can reliably create `UnionOperation`s from<br/>
their RBXM/RBXMX data.

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
                partToAttachTo=Instance.new("Part",model);
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

## Credits
- Superduperdev2 (Research, Documentation, Code)
- Insert Wars Remastered (Source of uploaded assets for research)
