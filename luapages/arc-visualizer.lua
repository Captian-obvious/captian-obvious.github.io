local id = "" -- module id--
local createArc = require(id)
local maxPL = 0

function createCircle(pos,r,num) --creates a circle of CFrames and Vector3 positions
    local angle_step = (math.pi*2)/num
    local t = {}
    for i=1,num do
        local angle = angle_step * i
        local newPos = Vector3.new(pos.X+math.cos(angle)*r,pos.Y,pos.Z+math.sin(angle)*r)
        local newCF = CFrame.new(pos, newPos)
        t[i] = {CFrame = newCF, Position = newPos}
    end
    return t
end
