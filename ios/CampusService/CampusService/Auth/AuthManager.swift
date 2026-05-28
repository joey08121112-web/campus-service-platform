import Foundation

class AuthManager: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var token: String?
    @Published var user: User?

    init() {
        token = UserDefaults.standard.string(forKey: "token")
        isLoggedIn = token != nil
    }

    func login(token: String, user: User) {
        self.token = token
        self.user = user
        self.isLoggedIn = true
        UserDefaults.standard.set(token, forKey: "token")
    }

    func logout() {
        token = nil
        user = nil
        isLoggedIn = false
        UserDefaults.standard.removeObject(forKey: "token")
    }
}
