using System;
using System.IO;
using System.Collections.Generic;

public class RecursiveParser {
    public List<string> FileList;
    private string serverUrl;

    public RecursiveParser(string path, string serverurl) {
        FileList = new List<string>();
        serverUrl = serverurl;
        ProcessDirectory(path);
    }

    private void ProcessDirectory(string path) {
        string[] files = Directory.GetFiles(path);
        foreach(string file in files) {
            FileList.Add(file);
            Console.WriteLine("Initiating upload: " + file);
            FileUploader.UploadFile(file, serverUrl);
        }

        string[] directories = Directory.GetDirectories(path);
        foreach(string dir in directories) {
            ProcessDirectory(dir);
        }
    }
    
}