struct Product: Codable, Identifiable {
    let id: Int
    let merchantId: Int?
    let name: String
    let description: String?
    let price: Double
    let image: String?
    let category: String?
    let stock: Int?
    let status: Int?

    enum CodingKeys: String, CodingKey {
        case id, name, description, price, image, category, stock, status
        case merchantId = "merchant_id"
    }
}
