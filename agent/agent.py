from fastapi import FastAPI, HTTPException
import uvicorn
import os
import json
from pydantic import BaseModel
from typing import Dict, Optional
import commune as c 
# Pydantic model for module dat
import requests
from .utils import load_json, save_json, logs
class Agent:
    server_port = 8000
    app_port = 3000
    app_name =  __file__.split('/')[-3] + '_app' 
    model='anthropic/claude-3.5-sonnet'
    free = True
    endpoints = ["get_modules", 'modules', 'add_module', 'remove', 'update', 'test']
    modules_path = __file__.replace(__file__.split('/')[-1], 'modules')
    
    # In-memory storage for modules
    
    def get_module_path(self, module_id):
        return f"{self.modules_path}/{module_id}.json"

    def ls(self, path=modules_path):
        if not os.path.exists(path):
            print('WARNING IN LS --> Path does not exist:', path)
            return []
        path = os.path.abspath(path)
        return c.ls(path)

    def logs(name):
        return c.logs(name)

    def check_module(self, module):
        assert isinstance(module, dict), "Module must be a dictionary"
        assert "name" in module, "Module must have a name"
        assert "url" in module, "Module must have a url"
        assert "key" in module, "Module must have a key"
        assert "github" in module, "Module must have a key_type"
        assert "description" in module, "Module must have a description"

    def save_module(self, module):
        self.check_module(module)
        module_path = self.get_module_path(module["key"])
        save_json(module_path, module)
        return {"message": f"Module {module['key']} updated successfully"}

    def get_module(self, module_id):
        module_path = self.get_module_path(module_id)
        return load_json(module_path)
    
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
            module = load_json(module_path)
            module_id = module['key']
            modules[module_id] = module
        return list(modules.values())

    def add_module(self, name  = "module", 
            url  = "http://comhub.com",
            key  = "module_key",
            github = "fam",
            description = "Module description", **kwargs ):
        
        module = {
            "name": name,
            "url": url,
            "key": key,
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
        return load_json(self.modules_path)

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
        self.add_module(test_module)
        assert self.module_exists(test_module['name']), "Module not added"
        self.remove_module(test_module['name'])
        assert not self.module_exists(test_module['name']), "Module not removed"
        return {"message": "All tests passed"}
    


    avoid_terms = ['__pycache__', '.ipynb_checkpoints', "node_modules", ".git", ".lock", "public", "json"]

    def serve(self, port=server_port):
        return c.serve(self.module_name(), port=port)
    
    def kill_app(self, name=app_name, port=app_port):
        while c.port_used(port):
            c.kill_port(port)
        return c.kill(name)

    
    def app(self, name=app_name, port=app_port, remote=0):
        self.kill_app(name, port)
        c.cmd(f"pm2 start yarn --name {name} -- dev --port {port}")
        return c.logs(name, mode='local' if remote else 'cmd')
    
    def fix(self, name=app_name, model=model):
        logs = c.logs(name, mode='local')
        files =   self.files(f"{logs}")
        context = {f: c.get_text(f) for f in files}
        prompt = f"CONTEXT {context} LOGS  {logs} OBJECTIVE fix the issue"
        print('Sending prompt:',len(prompt))
        return c.ask(prompt[:10000], model=model)

    def query(self,  
              options : list,  
              query='most relevant files', 
              output_format="list[[key:str, score:float]]",  
              anchor = 'OUTPUT', 
              threshold=0.5,
              n=10,  
              model=model):

        front_anchor = f"<{anchor}>"
        back_anchor = f"</{anchor}>"
        output_format = f"DICT(data:{output_format})"
        print(f"Querying {query} with options {options}")
        prompt = f"""
        QUERY
        {query}
        OPTIONS 
        {options} 
        INSTRUCTION 
        get the top {n} functions that match the query
        OUTPUT
        (JSON ONLY AND ONLY RESPOND WITH THE FOLLOWING INCLUDING THE ANCHORS SO WE CAN PARSE) 
        {front_anchor}{output_format}{back_anchor}
        """
        output = ''
        for ch in c.ask(prompt, model=model): 
            print(ch, end='')
            output += ch
            if ch == front_anchor:
                break
        if '```json' in output:
            output = output.split('```json')[1].split('```')[0]
        elif front_anchor in output:
            output = output.split(front_anchor)[1].split(back_anchor)[0]
        else:
            output = output
        output = json.loads(output)
        assert len(output) > 0
        return [k for k,v in output["data"] if v > threshold]

    def files(self, query='the file that is the core of commune',  path='./',  n=10, model='anthropic/claude-3.5-sonnet-20240620:beta'):
        files =  self.query(options=c.files(path), query=query, n=n, model=model)
        return [c.abspath(path+k) for k in files]
    
    networks = ['ethereum',
                 'bitcoin', 
                 'solana', 
                 'bittensor', 
                 'commune']
    def is_valid_network(self, network):
        return network in self.networks
    
    def get_key(self, password, **kwargs):
        return c.str2key(password, **kwargs)

    def feedback(self, path='./',  model=model):
        code = c.file2text(path)
   
        prompt = f"""

        PROVIDE FEEDBACK and s a score out of 100 for the following prompt on quality 
        and honesty. I want to make sure these are legit and there is a good chance 
        they are not. You are my gaurdian angel.
        {code}        
        OUTPUT_FORMAT MAKE SURE ITS IN THE LINES
        <OUTPUT><DICT(pointers:str, score:int (out of 100))></OUTPUT>
        OUTPUT
        """

        return c.ask(prompt, model=model)