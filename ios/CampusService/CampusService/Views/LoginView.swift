import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authManager: AuthManager
    @State private var username = ""
    @State private var password = ""
    @State private var isLoading = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            VStack(alignment: .leading, spacing: 8) {
                Text("登录")
                    .font(.system(size: 34, weight: .bold))
                Text("登录您的账号")
                    .font(.system(size: 17))
                    .foregroundColor(.secondary)
            }
            .padding(.bottom, 40)

            VStack(spacing: 0) {
                HStack {
                    Text("用户名")
                        .frame(width: 70, alignment: .leading)
                    TextField("请输入用户名", text: $username)
                        .textFieldStyle(.plain)
                }
                .padding(16)

                Divider()

                HStack {
                    Text("密码")
                        .frame(width: 70, alignment: .leading)
                    SecureField("请输入密码", text: $password)
                        .textFieldStyle(.plain)
                }
                .padding(16)
            }
            .background(Color.white)
            .cornerRadius(14)
            .padding(.bottom, 30)

            Button(action: login) {
                if isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity)
                        .padding(16)
                } else {
                    Text("登录")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(16)
                }
            }
            .background(Color.blue)
            .cornerRadius(14)
            .disabled(isLoading)

            Spacer()
        }
        .padding(20)
        .background(Color(.systemGray6))
    }

    func login() {
        isLoading = true
        // API call would go here
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            isLoading = false
        }
    }
}
