function fft(size, func, x)
    local t = {}
    local v = 0
    for n=1, size do
        v = v + func(n)
        t[n] = 10e40 * (v*func(n/size)*(math.sin(2*math.pi*(n/size)*x* size))) * 255
    end
    return t
end

function testfunction(x)
    return math.sin(2*math.pi*x)
end

function work()
    n=5
    for i=1,n do
        local e = fft(64,testfunction,i)
        for c=1,#e do
            print(""..e[c])
        end
    end
end
