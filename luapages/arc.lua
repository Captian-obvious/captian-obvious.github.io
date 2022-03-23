local createArc = require(9119811552)
function arc(pos1,pos2,num)
    local mag = (pos1 - pos2).magnitude
    if mag < 5 then
        createArc(pos1,pos2,mag,num)
    else
        createArc(pos1,pos2,mag/5,num)
    end
end
local pos = workspace.Superduperbloxer2.Head.Position
local spos = pos+Vector3.new(math.random(-10,10), 0, math.random(-10,10))
arc(pos,spos,5)
