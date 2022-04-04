function fft(size, func, x)
    local t = {}
    local v = 0
    local max = 1
    for n=0, size-1 do
        v = v + func(n)
        local l = (v+func(n/size)*(math.cos(2*math.pi*(n/size)*x* size)))
        max = math.max(l,max)
        t[n] = l/max*255
    end
    return t
end

function testfunction(x)
    return math.sin(20*math.pi*x)
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
