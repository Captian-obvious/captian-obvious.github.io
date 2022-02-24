local service = {
    queue = {};
};

function DestroyItem(instance)
    local function recursive(obj)
        spawn(function()
            if obj~=workspace and not obj:IsA("Player") and not obj:IsA("Backpack") and not obj:FindFirstChildWhichIsA("BasePart") then
                local parts = {}
                for _,thing in pairs(obj:GetChildren()) do
                    spawn(function()
                        if thing:IsA("BasePart") then
                            parts[#parts+1] = thing
                        elseif thing:IsA("Model") or thing:IsA("Folder") then
                            recursive(thing)
                        end
                    end)
                end
                if #parts == 0 then
                    local objParent = obj.Parent
                    obj:Destroy()
                    recursive(objParent)
                end
            end
        end)
    end
    local parent = instance.Parent
    instance:Destroy()
    recursive(parent)
end

function service:addItem(instance, t)
    local queue = service.queue
    table.insert(queue, instance)
    spawn(function()
        ti = tick()
        while instance.Parent ~=nil do
            local current = ti-tick()
            if current >= t then
                table.remove(queue, instance)
                DestroyItem(instanceProps.object)
            end
            wait()
        end
    end)
end

return service
