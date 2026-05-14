import pydantic
print("Pydantic loaded successfully")
from pydantic import BaseModel
class Test(BaseModel):
    id: int
print("BaseModel worked")
