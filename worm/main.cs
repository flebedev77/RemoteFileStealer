using System;
using System.IO;

public class MainClass {
    public static void Main(String[] args) {
        string path = "practice/";
        string serverUrl = "http://127.0.0.1:8080/upload";
        if (args.Length == 1) {
            path = args[0];
        } else if (args.Length == 2) {

        }

        if (!Directory.Exists(path)) {
            Console.WriteLine("Specified Directory Dosen't Exist! " + path);
            return;
        }


        // FileUploader.UploadFile(path, "http://127.0.0.1:8080/upload");

        RecursiveParser parser = new RecursiveParser(path);

        foreach(string filepath in parser.FileList) {
            Console.WriteLine("Initiating upload: " + filepath);
            FileUploader.UploadFile(filepath, "http://127.0.0.1:8080/upload");
        }
    }
}