function int(func, start, stop, delta)
    local delta = delta or 1e-4
    local v = 0
    for i = start, stop, delta do
        i = i + func(v)*delta
    end
    return i
end
int(math.cos(x*math.pi*t)*d*t
