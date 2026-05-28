import Foundation

class APIService {
    static let shared = APIService()
    private let baseURL = "http://localhost:3000/api"

    func request<T: Decodable>(_ path: String, method: String = "GET", body: [String: Any]? = nil, token: String? = nil) async throws -> T {
        guard let url = URL(string: baseURL + path) else { throw URLError(.badURL) }
        var request = URLRequest(url: url)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token = token {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body = body {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }
        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(APIResponse<T>.self, from: data)
        if response.code == 200, let data = response.data {
            return data
        }
        throw NSError(domain: "", code: response.code, userInfo: [NSLocalizedDescriptionKey: response.message ?? "Error"])
    }
}

struct APIResponse<T: Decodable>: Decodable {
    let code: Int
    let data: T?
    let message: String?
}
