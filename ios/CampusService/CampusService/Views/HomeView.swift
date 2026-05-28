import SwiftUI

struct HomeView: View {
    let services = [
        ("订餐", "🍜", Color.red),
        ("打印", "🖨️", Color.green),
        ("零食", "🍪", Color.orange),
        ("代取", "🛵", Color.purple),
        ("快递", "📦", Color.blue),
        ("搬运", "🧳", Color.teal),
        ("闲置", "♻️", Color.gray),
        ("兼职", "💼", Color.pink),
        ("商家", "🏪", Color.indigo)
    ]

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    // Hero
                    VStack(alignment: .leading, spacing: 8) {
                        Text("校园综合服务")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Text("一站式校园生活平台")
                            .font(.system(size: 32, weight: .bold))
                            .kerning(-0.5)
                    }
                    .padding(24)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.white)
                    .cornerRadius(20)
                    .shadow(color: .black.opacity(0.04), radius: 8, y: 2)

                    // Services
                    Text("服务")
                        .font(.system(size: 20, weight: .bold))
                        .padding(.horizontal, 4)

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 0), count: 3), spacing: 0) {
                        ForEach(services, id: \.0) { service in
                            VStack(spacing: 10) {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 16)
                                        .fill(Color(.systemGray6))
                                        .frame(width: 56, height: 56)
                                    Text(service.1)
                                        .font(.system(size: 28))
                                }
                                Text(service.0)
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.primary)
                            }
                            .padding(.vertical, 18)
                        }
                    }
                    .background(Color.white)
                    .cornerRadius(16)

                    // Merchants
                    HStack {
                        Text("推荐商家")
                            .font(.system(size: 20, weight: .bold))
                        Spacer()
                        Text("查看全部")
                            .font(.system(size: 15))
                            .foregroundColor(.blue)
                    }
                    .padding(.horizontal, 4)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 14) {
                            ForEach(0..<3) { _ in
                                VStack(alignment: .leading) {
                                    RoundedRectangle(cornerRadius: 14)
                                        .fill(Color(.systemGray6))
                                        .frame(width: 160, height: 100)
                                        .overlay(Text("🍜").font(.system(size: 40)))
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("川味窗口")
                                            .font(.system(size: 15, weight: .semibold))
                                        Text("一食堂")
                                            .font(.system(size: 12))
                                            .foregroundColor(.secondary)
                                    }
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 8)
                                }
                                .background(Color.white)
                                .cornerRadius(14)
                                .shadow(color: .black.opacity(0.04), radius: 6, y: 1)
                            }
                        }
                    }
                }
                .padding(16)
            }
            .background(Color(.systemGray6))
            .navigationBarHidden(true)
        }
    }
}
