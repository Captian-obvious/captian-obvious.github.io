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
    for i=1,64 do
        print(""..fft(64,testfunction,i)[i])
    end
end
