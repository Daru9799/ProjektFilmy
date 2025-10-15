using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;

namespace MoviesWebApplication.Common.Responses
{
    public abstract class ApiResponseBase
    {
        public int StatusCode { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public DateTime Time { get; set; }

        protected ApiResponseBase(int statusCode, string type, string message)
        {
            StatusCode = statusCode;
            Type = type;
            Message = message;
            Time = DateTime.Now;
        }
    }

    // Wersja z danymi
    /*public class ApiResponse<T> : ApiResponseBase
    {
        public T Data { get; set; }

        public ApiResponse(int statusCode, string type, string message, T data = default)
            : base(statusCode, type,  message)
        {
            Data = data;
        }

        public static ApiResponse<T> Success(T data, string message = "Success", string type = "OK")
            => new ApiResponse<T>(200, type,  message, data);
    }*/

    // Wersja bez danych
    public class ApiResponse : ApiResponseBase
    {
        public ApiResponse(int statusCode, string type, string message)
            : base(statusCode, type, message) { }

        public static ApiResponse Success(string message = "Zapytanie zostało wykonane pomyślnie.")
            => new ApiResponse(200, "OK", message);
        public static ApiResponse BadRequest(string message)
            => new ApiResponse(400, "Bad Request", message);
        public static ApiResponse Unauthorized(string message)
            => new ApiResponse(401, "Unauthorized", message);
        public static ApiResponse Forbidden(string message)
            => new ApiResponse(403, "Forbidden", message);
        public static ApiResponse NotFound(string message)
            => new ApiResponse(404, "Not Found", message);
        public static ApiResponse Conflict(string message)
            => new ApiResponse(409, "Conflict", message);
        public static ApiResponse InternalServerError(string message)
            => new ApiResponse(500, "Internal Server Error", message);
    }
}

