import discord

class UserClient(discord.Client):
        async def on_ready(self):
                print("logged in as ", self.user)

client = UserClient()
client.run("FqlUybjC619jO3Mc5ul7tA9whImEQrmwLiZYiTAp4gAxLoiEVOJE9uCQurB2qFkCwdAbWhW3QvKK4TRf8eZ3")
