local oldReq = require

require = function(id)
    local marketPlaceService = game:GetService("MarketplaceService")
    local asset = marketPlaceService:GetProductInfo(id)
    if asset then
        if blacklist[asset.Name] then
            return error("Error Requiring Asset: Asset "..asset.Name.."is on this game's Blacklist, it will not be ran.")
        else
            return oldReq(id)
        end
    end
end
