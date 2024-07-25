using System;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;

public class FileUploader
{
  public static void UploadFile(string filePath, string serverUrl)
  {
    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
    using (WebClient client = new WebClient())
    {
      // Set headers (optional)
      client.Headers.Add("Content-Type", "application/octet-stream");
      client.Headers.Add("Original-Filename", filePath.Replace(MainClass.path + "\\", ""));

      // Upload the file
      byte[] res = client.UploadFile(serverUrl, filePath);

      Console.WriteLine("File uploaded: " + filePath);
      Console.WriteLine(System.Text.Encoding.ASCII.GetString(res));
    }
  }
}
