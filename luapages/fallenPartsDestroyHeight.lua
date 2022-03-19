function recursive(obj)
    spawn(function()
        if obj~=workspace and not obj:IsA("Player") and not obj:IsA("Backpack") and not obj:FindFirstChildOfClass("Humanoid") and not obj:FindFirstChildWhichIsA("BasePart") then
            local numParts = 0
            for _,thing in pairs(obj:GetChildren()) do
                spawn(function()
                    if thing:IsA("BasePart") then
                        numParts += 1
                    elseif thing:IsA("Model") or thing:IsA("Folder") or thing:IsA("Accoutrement") then
                        numParts += 1
                        recursive(thing)
                    end
                end)
            end
            if numParts < 1 then
                local objParent = obj.Parent
                obj:Destroy()
                recursive(objParent)
            end
        end
    end)
end

while script.Disabled == false do
    local ds = workspace:GetDescendants()
    for _,d in pairs(ds) do
        spawn(function()
            if (d:IsA("BasePart") and d.Position.Y < script.FallenPartsDestroyHeight.Value) then
                local model = d.Parent
                d.Velocity = Vector3.new(0,0,0)
                local bv = Instance.new("BodyVelocity", d)
                bv.MaxForce = Vector3.new(10000,10000,10000)
                bv.Velocity = Vector3.new(0,0.01,0)
                wait(0.2)
                d:Destroy()
                recursive(model)
            end
        end)
    end
    wait()
end
