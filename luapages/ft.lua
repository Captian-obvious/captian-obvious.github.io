function sum(t)
    local sum = 0
    for k,v in pairs(t) do
        sum = sum + v
    end
    return sum
end
function fft(size, func, x, endval)
    for n=1, endval do
        func[n]*math.sin(2*math.pi* (n/size) * x * size)
    end
end
