local Services = {
    RunService = game:GetService("RunService"),
    Players = game:GetService("Players"),
}
local id = nil -- module id--
local createArc = require(id)
local mpl = 0
local sound = script:FindFirstChild("Music")

function createCircle(pos,r,num) --creates a circle of CFrames and Vector3 positions
    local angle_step = (math.pi*2)/num
    local t = {}
    for i=1,num do
        local angle = angle_step * i
        local newPos = Vector3.new(pos.X+math.cos(angle)*r,pos.Y,pos.Z+math.sin(angle)*r)
        local newCF = CFrame.new(pos, newPos)
        t[i] = {Cframe = newCF, Position = newPos}
    end
    return t
end

function set(b,x)
    if not params.Circle then
        params.Circle = createCircle(myPos, params.Radius, params.count)
    end
    local arc = createArc(
end

Services.RunService.RenderStepped:Connect(function()
    local pl = sound.PlaybackLoudness
    mpl = math.max(mpl,pl)
    pl = pl/mpl
    
end)
