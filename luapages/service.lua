local service = {
    queue = {};
};

function DestroyItem(instance)
    local function recursive(obj)
        spawn(function()
            if obj~=workspace and not obj:IsA("Player") and not obj:IsA("Backpack") and not obj:FindFirstChildWhichIsA("BasePart") then
                local folder = obj:FindFirstChildWhichIsA("Folder")
                local model = obj:FindFirstChildWhichIsA("Model")
                if folder then
                    recursive(folder)
                elseif model then
                    recursive(model)
                else
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
