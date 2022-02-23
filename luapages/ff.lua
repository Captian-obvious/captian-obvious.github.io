local plr = script.Owner.Value

function weld(Part0,Part1)
    local C0 = CFrame.new(Part0.Position) * Part0.CFrame:inverse()
    local C1 = CFrame.new(Part1.Position) * Part0.CFrame:inverse()
    local weld = Instance.new('ManualWeld', Part0)
    weld.Part0 = Part0
    weld.Part1 = Part1
    weld.C0 = C0
    weld.C1 = C1
end

function createCustomForceField(forcefield : ForceField, color : Color3)
    forcefield.Visible = false
    local torso = forcefield.Parent:FindFirstChild("Torso") or forceField.Parent:FindFirstChild("UpperTorso")
    local ffPart = Instance.new("Part", torso)
    ffPart.Size = Vector3.new(7,7,7)
    ffPart.Position = torso.Position
    ffPart.Shape = Enum.PartType.Ball
    ffPart.Material = Enum.Material.ForceField
    ffPart.TopSurface = Enum.SurfaceType.Smooth
    ffPart.BottomSurface = Enum.SurfaceType.Smooth
    ffPart.CanCollide = false
    ffPart.Anchored = true
    ffPart.Name = "basePartForceField"
    local box = Instance.new("SelectionSphere", forcefield)
    box.SurfaceColor = color
    box.SurfaceTransparency = 0.7
    box.Transparency = 0.5
    box.Color = color
    box.Adornee = ffPart
    torso.Anchored = true
    weld(torso, ffPart)
    wait()
    torso.Anchored = false
    ffPart.Anchored = false
    forcefield.Destroying:Connect(function()
        ffPart:Destroy()
    end)
end

if plr.Character~=nil then
    plr.Character.ChildAdded:Connect(function(child)
        if child:IsA("ForceField") then
            createCustomForceField(child, script.Color.Value)
        end
    end)
    plr.CharacterAdded:Connect(function(Character)
        Character.ChildAdded:Connect(function(child)
            if child:IsA("ForceField") then
                createCustomForceField(child, script.Color.Value)
            end
        end)
    end)
else
    plr.CharacterAdded:Connect(function(Character)
        Character.ChildAdded:Connect(function(child)
            if child:IsA("ForceField") then
                createCustomForceField(child, script.Color.Value)
            end
        end)
    end)
end
