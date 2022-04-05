local pi = math.pi
local sin = math.sin
local cos = math.cos
function getGreaterNumber(x,y)
    if x > y then
        return x
    else
        return y
    end
end
function fft(size, func, x)
    local t = {}
    local v = 0
    local max = 1
    for n=0, size-1 do
        v = v + func(n)
        local l = (v+func(n/size)*(cos(2*pi*(n/size)*x*size)))
        max = getGreaterNumber(max,l)
        t[n] = math.ceil(l/max*255)
    end
    return t
end

function testfunction(x)
    return sin(20*pi*x)
end

function work()
    n=1
    for i=1,n do
        local e = fft(64,testfunction,i)
        for c=1,#e do
            print(""..math.sqrt(e[c]^2))
        end
    end
end
work()
