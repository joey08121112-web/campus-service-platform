struct Merchant: Codable, Identifiable {
    let id: Int
    let name: String
    let area: String?
    let image: String?
    let status: Int?
}
