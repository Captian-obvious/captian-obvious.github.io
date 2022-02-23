local p = script.Owner.Value

function weld(Part0,Part1)
    local C0 = CFrame.new(Part0.Position) * Part0.CFrame:inverse()
    local C1 = CFrame.new(Part0.Position) * Part1.CFrame:inv
end
