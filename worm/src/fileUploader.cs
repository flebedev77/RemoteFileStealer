using System;
using System.IO;
using System.Net;

public class FileUploader
{
  public static void UploadFile(string filePath, string serverUrl)
  {
    using (WebClient client = new WebClient())
    {
      // Set headers (optional)
      client.Headers.Add("Content-Type", "application/octet-stream");
      client.Headers.Add("Original-Filename", filePath.Replace(MainClass.path, ""));

      // Upload the file
      byte[] res = client.UploadFile(serverUrl, filePath);
      
      Console.WriteLine("File uploaded: " + filePath);
      Console.WriteLine(System.Text.Encoding.ASCII.GetString(res));
    }
  }
}
