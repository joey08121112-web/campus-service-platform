struct User: Codable, Identifiable {
    let id: Int
    let openid: String?
    let name: String?
    let phone: String?
    let studentId: String?
    let dormitory: String?
    let room: String?

    enum CodingKeys: String, CodingKey {
        case id, openid, name, phone, dormitory, room
        case studentId = "student_id"
    }
}
