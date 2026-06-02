import http.server
import os
os.chdir("/Users/wangyingyue/Documents/diandi_record")
handler = http.server.SimpleHTTPRequestHandler
server = http.server.HTTPServer(("", 8765), handler)
server.serve_forever()
