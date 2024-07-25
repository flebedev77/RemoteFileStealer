using System;
using System.IO;
using System.Collections.Generic;

public class RecursiveParser {
    public List<string> FileList;

    public RecursiveParser(string path) {
        FileList = new List<string>();
        ProcessDirectory(path);
    }

    private void ProcessDirectory(string path) {
        string[] files = Directory.GetFiles(path);
        foreach(string file in files) {
            FileList.Add(file);
        }

        string[] directories = Directory.GetDirectories(path);
        foreach(string dir in directories) {
            ProcessDirectory(dir);
        }
    }
    
}