--[[

	- Install this module on "ReplicatedStorage" Service, it is Client/Server side!
	
	* HOW TO USE:
	
	 First, to use module's functions, you need require them, like this:
	 
	 	local SafeFunctions = require(game:GetService("ReplicatedStorage").SafeFunctions)
	
	 Now, to make a "safe invoke" with this module, you need to bind the function which
	 the other side will await return:
	 
	 	-- Server
		SafeFunctions:BindToInvokeServer("Test", function(Player, ...)
			return Player.Name .. " has invoked the server!"
		end)
		
		The first parameter is the name of "SafeRemoteFunction", which is used to invoke
		from the other side:
		
		-- Client
		print(SafeFunctions:InvokeServer("Test", 0))
		
		Another cool parameter is the second parameter of InvokeServer(), this is the
		"TimeOut", it defines how long the invoke still awaiting after automatic stopped, 
		(you can set to 0 if you don't wanna this)
		
	You can unbind and stop invokes manually, with the functions:
	
	- BindToInvokeClient(FunctionName, Function)
	- UnbindInvokeClient(FunctionName)
	- StopInvokeClient(Client, FunctionName) (Server)
	
	- BindToInvokeServer(FunctionName, Function)
	- UnbindInvokeServer(FunctionName)
	- StopInvokeServer(FunctionName) (Client)
	
	Invoke functions:
	
	- InvokeServer(FunctionName, TimeOut, ...): Tuple
	- InvokeClient(Client, FunctionName, TimeOut,  ...): Tuple
	
	The module's yielding loop takes 1/10th of a second to check if can stop
	with TimeOut duration.
	
	Last, if you define the "TimeOut" to 0, you might check if the default yielding
	time is acceptable for you here:
]]
local clientyield = 5 -- How much time client await for server return 
local serveryield = 5 -- How much time server await for client return

local SafeFunctions = {}

local RunService = game:GetService("RunService")

local DataTransfer = script:FindFirstChild("DataTransfer") do
	DataTransfer = DataTransfer or Instance.new("RemoteEvent", script)
	DataTransfer.Name = "DataTransfer"
end

local ServerDataTransfer = script:FindFirstChild("ServerDataTransfer") do
	ServerDataTransfer = ServerDataTransfer or Instance.new("RemoteEvent", script)
	ServerDataTransfer.Name = "ServerDataTransfer"
end

if RunService:IsServer() then -- SERVER SIDE	
	-- Client fires to server give a return
	if not SafeFunctions.__ServerConnection then
		SafeFunctions.__ServerConnection = ServerDataTransfer.OnServerEvent:Connect(function(Player, Name, ...)
			if SafeFunctions[Name] then
				ServerDataTransfer:FireClient(Player, Name, SafeFunctions[Name](Player, ...) )
				else warn(string.format("No binding '%s' made in Server!", Name))
			end
		end)
	end
	
	function SafeFunctions:InvokeClient(Player: Player, Name: string, Timeout: number, ...): Tuple
		Timeout = Timeout or 0
		local connection
		local client_return = "_NONE_"
		
		SafeFunctions[Player.Name .. Name] = true
		
		connection = DataTransfer.OnServerEvent:Connect(function(plr, name,  ...)
			if plr == Player and name == Name then
				connection:Disconnect()
				client_return = ...
			end
		end)
		DataTransfer:FireClient(Player, Name, ...)
		
		for i = 1, (Timeout > 0 and Timeout or serveryield)*10 do
			if client_return ~= "_NONE_" or not SafeFunctions[Player.Name .. Name] then break end
			task.wait(.1)
		end
		-- Disconnects and unbind
		connection:Disconnect()
		SafeFunctions[Player.Name .. Name] = nil
		
		if client_return ~= "_NONE_" then
			return client_return
		end
	end
	
	function SafeFunctions:StopInvokeClient(Player: Player, Name: string)
		SafeFunctions[Player.Name .. Name] = nil
	end
	
	function SafeFunctions:BindToInvokeServer(Name: string, func: "function")
		SafeFunctions[Name] = func
	end
	
	function SafeFunctions:UnbindInvokeServer(Name: string)
		SafeFunctions[Name] = nil
	end
	
elseif RunService:IsClient() then -- CLIENT SIDE
	-- Server fires to client give a return
	DataTransfer.OnClientEvent:Connect(function(Name, ...)
		if SafeFunctions[Name] then
			DataTransfer:FireServer(Name, SafeFunctions[Name](...))
			else warn(string.format("No binding '%s' made in client!", Name))
		end
	end)
	
	function SafeFunctions:InvokeServer(Name: string, Timeout: number, ...): Tuple
		Timeout = Timeout or 0
		local connection
		local server_return = "_NONE_"

		SafeFunctions["_Server" .. Name] = true

		connection = ServerDataTransfer.OnClientEvent:Connect(function(name,  ...)
			if name == Name then
				connection:Disconnect()
				server_return = ...
			end
		end)
		ServerDataTransfer:FireServer(Name, ...)

		for i = 1, (Timeout > 0 and Timeout or clientyield)*10 do
			if server_return ~= "_NONE_" or not SafeFunctions["_Server" .. Name] then break end
			task.wait(.1)
		end
		connection:Disconnect()
		SafeFunctions["_Server" .. Name] = nil
		
		if server_return ~= "_NONE_" then
			return server_return
		end
	end
	
	function SafeFunctions:StopInvokeServer(Name: string)
		SafeFunctions["_Server" .. Name] = nil
	end
	
	function SafeFunctions:BindToInvokeClient(Name: string, Function: "function")
		SafeFunctions[Name] = Function
	end
	
	function SafeFunctions:UnbindInvokeClient(Name: string)
		SafeFunctions[Name] = nil
	end
	
end

return SafeFunctions
