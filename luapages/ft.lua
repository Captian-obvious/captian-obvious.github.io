function fft(size, func, x)
    local outOfX = 0
    for n=1, size do
        outOfX += func[n]*math.sin(2*math.pi* (n/size) * x * size)
    end
end
