from fastapi import FastAPI, HTTPException
import uvicorn
import os
import json
from pydantic import BaseModel
from typing import Dict, Optional
import commune as c 
# Pydantic model for module dat
import requests

class Agent:
    free = True
    server_functions = ["get_modules", 'modules', 'add', 'remove', 'update', 'test']
    modules_path = __file__.replace(__file__.split('/')[-1], 'modules')

    def save_json(self,file_path, data):
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'w') as f:
            json.dump(data, f)
        return {"message": f"Data saved to {file_path}"}

    def load_json(self, file_path):
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except:
            return {}
        
    # In-memory storage for modules

    def get_module_path(self, module_id):
        return f"{self.modules_path}/{module_id}.json"

    def ls(self, path=modules_path):
        if not os.path.exists(path):
            print('WARNING IN LS --> Path does not exist:', path)
            return []
        path = os.path.abspath(path)
        return c.ls(path)



    def check_module(self, module):
        assert isinstance(module, dict), "Module must be a dictionary"
        assert "name" in module, "Module must have a name"
        assert "url" in module, "Module must have a url"
        assert "key" in module, "Module must have a key"
        assert "key_type" in module, "Module must have a key_type"
        assert "description" in module, "Module must have a description"

    def save_module(self, module, module_id=None):
        if module_id is None:
            module_id = module['key']
        self.check_module(module)
        module_path = self.get_module_path(module_id)
        self.save_json(module_path, module)
        return {"message": f"Module {module_id} updated successfully"}

    def get_module(self, module_id):
        module_path = self.get_module_path(module_id)
        return self.load_json(module_path)
    
    def clear_modules(self):
        for module_path in self.ls(self.modules_path):
            print('Removing:', module_path)
            os.remove(module_path)
        return {"message": "All modules removed"}
    
    def get_modules(self):
        return self.modules()

    def modules(self):
        modules = {}
        for module_path in self.ls(self.modules_path):
            module = self.load_json(module_path)
            module_id = module['key']
            modules[module_id] = module
        return list(modules.values())

    def add(self,
            name  = "module", 
            url  = "http://module.com",
            key  = "module_key",
            github = "fam",
            description = "Module description",  
            key_type='eth' ):
        
        module = {
            "name": name,
            "url": url,
            "key": key,
            "key_type": key_type,
            "github": github,
            "description": description
        }
        print('Adding module:', module)
        assert not self.module_exists(module['name']), "Module already exists"
        self.save_module(module)
        result =  {"message": f"Module {module['name']} added successfully", "module": module}
        print('RESULT',result)
        return result

    def root():
        return {"message": "Module Management API"}

    def get_module(self, module_id: str):
        modules = self.get_modules()
        if module_id not in modules:
            raise HTTPException(status_code=404, detail="Module not found")
        return modules[module_id]

    def remove(self, module_id: str):
        assert self.module_exists(module_id), "Module not found"
        os.remove(self.get_module_path(module_id))
        return {"message": f"Module {module_id} removed successfully"}

    def module_exists(self, module_id: str):
        return os.path.exists(self.get_module_path(module_id))

    def get_modules(self):
        return self.load_json(self.modules_path)

    def update(self, module_id: str, module: Dict):
        if not self.module_exists(module_id):
            raise HTTPException(status_code=404, detail="Module not found")
        module = self.get_module(module_id)
        
        self.save_module(module_id, module)

    def test(self):
        
        # Test module data
        test_module = {
            "name": "test_module",
            "url": "http://test.com",
            "key": "test_key",
            "key_type": "string",
            "description": "Test module description"
        }

        # Add module
        self.add(test_module)
        assert self.module_exists(test_module['name']), "Module not added"
        self.remove(test_module['name'])
        assert not self.module_exists(test_module['name']), "Module not removed"
        return {"message": "All tests passed"}
    


    avoid_terms = ['__pycache__', '.ipynb_checkpoints', "node_modules", ".git", ".lock", "public", "json"]

    def filegate(self, file):
        for term in self.avoid_terms:
            if term in file:
                return False
        return True
     
    def file2text(self, path='./'):
        file2text = c.filegate(path)
        return file2text
    
    def file2size(self, path='./'):
        prefix = os.path.abspath(path)
        return {file.replace(prefix, path): len(text) for file, text in c.file2text(path).items()}

    def context(self):
        file2text = self.file2text()
        files = list(file2text.keys())
        return {
            "files": files,
            "file2text": file2text
        }
    
    def context_size(self):
        return len(str(self.context()))