local p = script.Owner.Value

function weld(Part0,Part1)
    local C0 = CFrame.new(Part0.Position) * Part0.CFrame:inverse()
    local C1 = CFrame.new(Part1.Position) * Part0.CFrame:inverse()
    local weld = Instance.new('ManualWeld',Part0)
    weld.Part0 = Part0
    weld.Part1 = Part1
    weld.C0 = C0
    weld.C1 = C1
end
function createCustomForceField(forcefield : ForceField, color : Color3)
    forcefield.Visible = false
    local ffPart = Instance.new("Part", forcefield)
    ffPart.Size = Vector3.new(7,7,7)
    ffPart.Position = forcefield.Parent:FindFirstChild("HumanoidRootPart")
    ffPart.Shape = Enum.PartType.Ball
    ffPart.Material = Enum.Material.ForceField
    ffPart.TopSurface = Enum.SurfaceType.Smooth
    ffPart.BottomSurface = Enum.SurfaceType.Smooth
    local box = Instance.new("SelectionSphere", forcefield)
    box.SurfaceColor = color
end
