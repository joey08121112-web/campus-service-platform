import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var authManager: AuthManager

    var body: some View {
        NavigationView {
            List {
                Section {
                    HStack(spacing: 14) {
                        Circle()
                            .fill(Color.blue)
                            .frame(width: 56, height: 56)
                            .overlay(Text("张").font(.system(size: 22, weight: .bold)).foregroundColor(.white))
                        VStack(alignment: .leading) {
                            Text("张同学")
                                .font(.system(size: 18, weight: .bold))
                            Text("学号 2024001")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.vertical, 8)
                }

                Section("我的订单") {
                    NavigationLink("订餐订单") { Text("订餐订单") }
                    NavigationLink("打印订单") { Text("打印订单") }
                    NavigationLink("零食订单") { Text("零食订单") }
                }

                Section("更多") {
                    NavigationLink("意见反馈") { Text("意见反馈") }
                    NavigationLink("设置") { Text("设置") }
                }

                Section {
                    Button("退出登录") {
                        authManager.logout()
                    }
                    .foregroundColor(.red)
                    .frame(maxWidth: .infinity)
                }
            }
            .navigationTitle("我的")
        }
    }
}
