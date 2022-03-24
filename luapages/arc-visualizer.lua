local Services = {
    RunService = game:GetService("RunService"),
    Players = game:GetService("Players"),
}
local params = {
    frequencyBinCount = 32,
    radius = 8,
    position = Vector3.new(0,0,0),
    circle = nil,
};
local createArc = require(9119811552)
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

function set(x)
    if not params.circle then
        params.circle = createCircle(params.position, params.radius, params.frequencyBinCount)
    end
    
end

Services.RunService.RenderStepped:Connect(function()
    local pl = sound.PlaybackLoudness
    mpl = math.max(mpl,pl)
    pl = pl/mpl
    
end)
