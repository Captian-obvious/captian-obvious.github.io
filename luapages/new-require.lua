local oldReq = require

local blacklist = {
    ["Ban Hammer"] = true,
    ["Anti-logger"] = true,
    ["BTT Console"] = true,
};

require = function(id)
    local MarketplaceService = game:GetService("MarketplaceService")
    local asset = MarketplaceService:GetProductInfo(id)
    if asset then
        if blacklist[asset.Name] then
            return error("Error Requiring Asset: Asset "..asset.Name.."is on this game's Blacklist, it will not be ran.")
        else
            return oldReq(id)
        end
    end
end
