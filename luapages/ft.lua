function fft(size, func, x)
    local t = {}
    local v = 0
    for n=1, size do
        v += func[n]*math.sin(2*math.pi*(n/size)*x* size)
        t[n] = v
    end
end
