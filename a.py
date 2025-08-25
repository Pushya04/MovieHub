import os

def list_structure(startpath, indent="", exclude=("node_modules",)):
    for item in os.listdir(startpath):
        if item in exclude:  # Skip unwanted folders
            continue
        path = os.path.join(startpath, item)
        print(indent + "|-- " + item)
        if os.path.isdir(path):
            list_structure(path, indent + "   ", exclude)

# Change this to your project folder path
project_path = r"C:\Users\pushy\OneDrive\Desktop\Major Project\Twitter Sentiment Analysis"
print("Project Structure:\n")
list_structure(project_path)
