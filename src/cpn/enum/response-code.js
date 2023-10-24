const responseMessages = {
    "0x4501000": {
        "vi": {
            "description": "Thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Success",
            "type": "Success"
        }
    },
    "0x4501001": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501002": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501003": {
        "vi": {
            "description": "Thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Success",
            "type": "Success"
        }
    },
    "0x4501004": {
        "vi": {
            "description": "Không tìm thấy người dùng",
            "type": "Lỗi"
        },
        "en": {
            "description": "User not found",
            "type": "Error"
        }
    },
    "0x4501005": {
        "vi": {
            "description": "Không có quyền truy cập API",
            "type": "Lỗi"
        },
        "en": {
            "description": "No API access",
            "type": "Error"
        }
    },
    "0x4501006": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501007": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501008": {
        "vi": {
            "description": "Tài khoản đã tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Account already exists",
            "type": "Error"
        }
    },
    "0x4501009": {
        "vi": {
            "description": "Không có quyền truy cập API",
            "type": "Lỗi"
        },
        "en": {
            "description": "No API access",
            "type": "Error"
        }
    },
    "0x4501010": {
        "vi": {
            "description": "Một vài trường dữ liệu bị bỏ trống hoặc không đúng quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Some data fields are blank or incorrect",
            "type": "Error"
        }
    },
    "0x4501011": {
        "vi": {
            "description": "Tạo tài khoản thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Account successfully created",
            "type": "Success"
        }
    },
    "0x4501012": {
        "vi": {
            "description": "Không tìm thấy thuộc tính account trong req.body hoặc account mang giá trị undefined",
            "type": "Lỗi"
        },
        "en": {
            "description": "The account attribute was not found in req.body or account has the value undefined",
            "type": "Error"
        }
    },
    "0x4501013": {
        "vi": {
            "description": "Người dùng không tồn tại hoặc đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The user does not exist or has been deleted",
            "type": "Error"
        }
    },
    "0x4501014": {
        "vi": {
            "description": "Bạn không thể xóa người dùng có quyền hạn lớn hơn hoặc bằng mình",
            "type": "Lỗi"
        },
        "en": {
            "description": "You cannot remove users with authority greater than or equal to yours",
            "type": "Error"
        }
    },
    "0x4501015": {
        "vi": {
            "description": "Xóa người dùng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "User deletion successful",
            "type": "Success"
        }
    },
    "0x4501016": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501017": {
        "vi": {
            "description": "Cập nhật thông tin người dùng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "User information updated successfully",
            "type": "Success"
        }
    },
    "0x4501018": {
        "vi": {
            "description": "Bạn không thể cập nhật một quyền mới lớn hơn hoặc bằng bản thân",
            "type": "Lỗi"
        },
        "en": {
            "description": "You cannot update a new permission that is greater than or equal to yourself",
            "type": "Error"
        }
    },
    "0x4501019": {
        "vi": {
            "description": "Bạn không thể cập nhật người dùng có quyền lớn hơn mình",
            "type": "Lỗi"
        },
        "en": {
            "description": "You cannot update users with greater permissions than you",
            "type": "Error"
        }
    },
    "0x4501020": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501021": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501022": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501023": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501024": {
        "vi": {
            "description": "Cập nhật thông tin người dùng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "User information updated successfully",
            "type": "Success"
        }
    },
    "0x4501025": {
        "vi": {
            "description": "Không thể cập nhật thông tin người dùng khác bằng API này",
            "type": "Lỗi"
        },
        "en": {
            "description": "Other user information cannot be updated using this API",
            "type": "Error"
        }
    },
    "0x4501026": {
        "vi": {
            "description": "Tài khoản bị xóa hoặc không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Account is deleted or does not exist",
            "type": "Error"
        }
    },
    "0x4501027": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501028": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501029": {
        "vi": {
            "description": "Cập nhật ảnh đại diện thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Updated profile picture successfully",
            "type": "Success"
        }
    },
    "0x4501030": {
        "vi": {
            "description": "Tệp lỗi",
            "type": "Lỗi"
        },
        "en": {
            "description": "Error file",
            "type": "Error"
        }
    },
    "0x4501031": {
        "vi": {
            "description": "Không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "There is no permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501032": {
        "vi": {
            "description": "Tài khoản không tồn tại hoặc bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The account does not exist or has been deleted",
            "type": "Error"
        }
    },
    "0x4501033": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501034": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501035": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501036": {
        "vi": {
            "description": "Cập nhật ảnh đại diện thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Updated profile picture successfully",
            "type": "Success"
        }
    },
    "0x4501037": {
        "vi": {
            "description": "Người dùng không tồn tại hoặc đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The user does not exist or has been deleted",
            "type": "Error"
        }
    },
    "0x4501038": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501039": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501040": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501041": {
        "vi": {
            "description": "  ",
            "type": "Thành công"
        },
        "en": {
            "description": "",
            "type": "Success"
        }
    },
    "0x4501042": {
        "vi": {
            "description": "Không tìm thấy dự án nào cả",
            "type": "Thành công"
        },
        "en": {
            "description": "No projects found",
            "type": "Success"
        }
    },
    "0x4501043": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501044": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501045": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501046": {
        "vi": {
            "description": " ",
            "type": "Thành công"
        },
        "en": {
            "description": "",
            "type": "Success"
        }
    },
    "0x4501047": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501048": {
        "vi": {
            "description": " ",
            "type": "Thành công"
        },
        "en": {
            "description": "",
            "type": "Success"
        }
    },
    "0x4501049": {
        "vi": {
            "description": "Không tìm thấy dự án",
            "type": "Lỗi"
        },
        "en": {
            "description": "No project found",
            "type": "Error"
        }
    },
    "0x4501050": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501051": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501052": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501053": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501054": {
        "vi": {
            "description": "Tạo dự án thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Create successful projects",
            "type": "Success"
        }
    },
    "0x4501055": {
        "vi": {
            "description": "Tạo dự án vào thêm người quản lý thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Create project and add manager successfully",
            "type": "Success"
        }
    },
    "0x4501056": {
        "vi": {
            "description": "Người dùng được chỉ định không có quyền làm quản lý dự án",
            "type": "Lỗi"
        },
        "en": {
            "description": "The specified user does not have project manager permissions",
            "type": "Error"
        }
    },
    "0x4501057": {
        "vi": {
            "description": "Người quản lý dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project manager does not exist",
            "type": "Error"
        }
    },
    "0x4501058": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501059": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501060": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501061": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501062": {
        "vi": {
            "description": "Tạo thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Created successfully",
            "type": "Success"
        }
    },
    "0x4501063": {
        "vi": {
            "description": "Một vài người dùng không được thêm vào dự án vì họ không tồn tại, không khả dụng hoặc đã có mặt trong dự án từ trước",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "Some users were not added to the project because they did not exist, were unavailable, or were previously in the project",
            "type": "Warning"
        }
    },
    "0x4501064": {
        "vi": {
            "description": "Không ai được thêm vào dự án vì họ không tồn tại, không khả dụng hoặc đã có mặt trong dự án từ trước",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "No one is added to the project because they don't exist, aren't available, or were previously in the project",
            "type": "Warning"
        }
    },
    "0x4501065": {
        "vi": {
            "description": "Bạn không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501066": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501067": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501068": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501069": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501070": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501071": {
        "vi": {
            "description": "Cập nhật dự án thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Project updated successfully",
            "type": "Success"
        }
    },
    "0x4501072": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501073": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501074": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501075": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501076": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501077": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501078": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501079": {
        "vi": {
            "description": "Xóa dự án thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Deleted project successfully",
            "type": "Success"
        }
    },
    "0x4501080": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Warning"
        }
    },
    "0x4501081": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501082": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501083": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501084": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501085": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501086": {
        "vi": {
            "description": "Thay đổi người quản lý thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successful change of manager",
            "type": "Success"
        }
    },
    "0x4501087": {
        "vi": {
            "description": "Người quản lý mới được chỉ định không tồn tại hoặc đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The newly assigned manager does not exist or has been deleted",
            "type": "Error"
        }
    },
    "0x4501088": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501089": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501090": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501091": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501092": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501093": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501094": {
        "vi": {
            "description": "Thay đổi thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successful change",
            "type": "Success"
        }
    },
    "0x4501095": {
        "vi": {
            "description": "Quyền mới phải nhỏ hơn quyền của người thực hiện thao tác",
            "type": "Lỗi"
        },
        "en": {
            "description": "The new permission must be less than the permission of the person performing the operation",
            "type": "Error"
        }
    },
    "0x4501096": {
        "vi": {
            "description": "Không thể thay đổi quyền của người có quyền lớn hơn người thực hiện",
            "type": "Lỗi"
        },
        "en": {
            "description": "The rights of those who have greater rights than those who exercise them cannot be changed",
            "type": "Error"
        }
    },
    "0x4501097": {
        "vi": {
            "description": "Tài khoản chỉ định không thuộc dự án",
            "type": "Lỗi"
        },
        "en": {
            "description": "The designated account is not part of the project",
            "type": "Error"
        }
    },
    "0x4501098": {
        "vi": {
            "description": "Tài khoản chỉ định không tồn tại hoặc bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The specified account does not exist or has been deleted",
            "type": "Error"
        }
    },
    "0x4501099": {
        "vi": {
            "description": "Không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "There is no permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501100": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501101": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501102": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501103": {
        "vi": {
            "description": "Bạn không thể thay đổi quyền của chính mình",
            "type": "Lỗi"
        },
        "en": {
            "description": "You cannot change your own permissions",
            "type": "Error"
        }
    },
    "0x4501104": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501105": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501106": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501107": {
        "vi": {
            "description": "Xóa thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Deleted successfully",
            "type": "Success"
        }
    },
    "0x4501108": {
        "vi": {
            "description": "Bạn không thể xóa người dùng có quyền hạn lớn hơn hoặc bằng mình",
            "type": "Lỗi"
        },
        "en": {
            "description": "You cannot remove users with authority greater than or equal to yours",
            "type": "Error"
        }
    },
    "0x4501109": {
        "vi": {
            "description": "Bạn không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501110": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501111": {
        "vi": {
            "description": "Mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid project code",
            "type": "Error"
        }
    },
    "0x4501112": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501113": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501114": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501115": {
        "vi": {
            "description": "Gọi dữ liệu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Called data successfully",
            "type": "Success"
        }
    },
    "0x4501116": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501117": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501118": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501119": {
        "vi": {
            "description": "Tạo yêu cầu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Created request successfully",
            "type": "Success"
        }
    },
    "0x4501120": {
        "vi": {
            "description": "Tạo yêu cầu thành công nhưng không có ai được thêm vào yêu cầu vì họ không thuộc dự án hoặc không còn khả dụng nữa",
            "type": "Thành công"
        },
        "en": {
            "description": "The request was created successfully, but no one was added to the request because they are not part of the project or are no longer available",
            "type": "Success"
        }
    },
    "0x4501121": {
        "vi": {
            "description": "Tạo yêu cầu thành cồng nhưng một vài thành viên không được thêm vào vì họ không thuộc dự án hoặc không còn khả dụng nữa",
            "type": "Thành công"
        },
        "en": {
            "description": "The request was created successfully, but some members were not added because they are not part of the project or are no longer available",
            "type": "Success"
        }
    },
    "0x4501122": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501123": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501124": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501125": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501126": {
        "vi": {
            "description": "Cập nhật trạng thái yêu cầu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Update request status successfully",
            "type": "Success"
        }
    },
    "0x4501127": {
        "vi": {
            "description": "Trạng thái không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid status",
            "type": "Error"
        }
    },
    "0x4501128": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501129": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501130": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501131": {
        "vi": {
            "description": "Không tìm thấy dự án hoặc mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Project not found or invalid project code",
            "type": "Error"
        }
    },
    "0x4501132": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501133": {
        "vi": {
            "description": "Cập nhật thông tin yêu cầu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Update request information successfully",
            "type": "Success"
        }
    },
    "0x4501134": {
        "vi": {
            "description": "Độ ưu tiên không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid priority",
            "type": "Error"
        }
    },
    "0x4501135": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501136": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501137": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501138": {
        "vi": {
            "description": "Không tìm thấy dự án hoặc mã dự án không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Project not found or invalid project code",
            "type": "Error"
        }
    },
    "0x4501139": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501140": {
        "vi": {
            "description": "Thêm thành viên thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Added members successfully",
            "type": "Success"
        }
    },
    "0x4501141": {
        "vi": {
            "description": "Một vài thành viên không được thêm vào vì không có quyền hoặc không khả dụng",
            "type": "Thành công"
        },
        "en": {
            "description": "Some members were not added because they did not have permissions or were unavailable",
            "type": "Success"
        }
    },
    "0x4501142": {
        "vi": {
            "description": "Không một ai được thêm vào yêu cầu vì không có quyền hoặc không khả dụng",
            "type": "Lỗi"
        },
        "en": {
            "description": "No one can be added to the request because they are not authorized or unavailable",
            "type": "Error"
        }
    },
    "0x4501143": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501144": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501145": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501146": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501147": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501148": {
        "vi": {
            "description": "Xóa thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Deleted successfully",
            "type": "Success"
        }
    },
    "0x4501149": {
        "vi": {
            "description": "Người dùng này không phải là thành viên của yêu cầu",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "This user is not a member of the request",
            "type": "Warning"
        }
    },
    "0x4501150": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501151": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501152": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501153": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501154": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501155": {
        "vi": {
            "description": "Cập nhật thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Update successful",
            "type": "Success"
        }
    },
    "0x4501156": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501157": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501158": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501159": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501160": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501161": {
        "vi": {
            "description": "Xóa yêu cầu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Delete request successfully",
            "type": "Success"
        }
    },
    "0x4501162": {
        "vi": {
            "description": "Bạn không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501163": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501164": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501165": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501166": {
        "vi": {
            "description": "Thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Success",
            "type": "Success"
        }
    },
    "0x4501167": {
        "vi": {
            "description": "Không tìm thấy dự án",
            "type": "Lỗi"
        },
        "en": {
            "description": "No project found",
            "type": "Error"
        }
    },
    "0x4501168": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501169": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501170": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501171": {
        "vi": {
            "description": "Thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Success",
            "type": "Success"
        }
    },
    "0x4501172": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501173": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501174": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501175": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501176": {
        "vi": {
            "description": "Cập nhật thông tin phiên bản thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Updated version information successfully",
            "type": "Success"
        }
    },
    "0x4501177": {
        "vi": {
            "description": "Phiên bản không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Version does not exist",
            "type": "Error"
        }
    },
    "0x4501178": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501179": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501180": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501181": {
        "vi": {
            "description": "Tài khoản của bạn đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "Your account has been deleted",
            "type": "Error"
        }
    },
    "0x4501182": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501183": {
        "vi": {
            "description": "Thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Success",
            "type": "Success"
        }
    },
    "0x4501184": {
        "vi": {
            "description": "Không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "There is no permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501185": {
        "vi": {
            "description": "Bạn không tồn tại trong dự án hoặc không có quyền",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not exist in the project or do not have permissions",
            "type": "Error"
        }
    },
    "0x4501186": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501187": {
        "vi": {
            "description": "Phiên bản không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Version does not exist",
            "type": "Error"
        }
    },
    "0x4501188": {
        "vi": {
            "description": "Bảng không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Table does not exist",
            "type": "Error"
        }
    },
    "0x4501189": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501190": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501191": {
        "vi": {
            "description": "Tạo bảng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Table created successfully",
            "type": "Success"
        }
    },
    "0x4501192": {
        "vi": {
            "description": "Không có quyền thực hiện thao tác này",
            "type": "Lỗi"
        },
        "en": {
            "description": "There is no permission to perform this operation",
            "type": "Error"
        }
    },
    "0x4501193": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501194": {
        "vi": {
            "description": "Phiên bản không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Version does not exist",
            "type": "Error"
        }
    },
    "0x4501195": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501196": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501197": {
        "vi": {
            "description": "Lấy dữ liệu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Retrieve data successfully",
            "type": "Success"
        }
    },
    "0x4501198": {
        "vi": {
            "description": "Bạn không có quyền truy cập api này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You do not have permission to access this API",
            "type": "Error"
        }
    },
    "0x4501199": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501200": {
        "vi": {
            "description": "Phiên bản không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Version does not exist",
            "type": "Error"
        }
    },
    "0x4501201": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501202": {
        "vi": {
            "description": "Cập nhật bảng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Table updated successfully",
            "type": "Success"
        }
    },
    "0x4501203": {
        "vi": {
            "description": "Xóa bảng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Table deleted successfully",
            "type": "Success"
        }
    },
    "0x4501204": {
        "vi": {
            "description": "Không có quyền thay đổi vì bạn không thuộc nhóm thực hiện yêu cầu",
            "type": "Lỗi"
        },
        "en": {
            "description": "There is no permission to make changes because you are not part of the team making the request",
            "type": "Error"
        }
    },
    "0x4501205": {
        "vi": {
            "description": "Tạo các trường thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Create fields successfully",
            "type": "Success"
        }
    },
    "0x4501206": {
        "vi": {
            "description": "Không tìm thấy trường nào trong request body",
            "type": "Lỗi"
        },
        "en": {
            "description": "No fields found in request body",
            "type": "Error"
        }
    },
    "0x4501206A": {
        "vi": {
            "description": "Bảng không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Table does not exist",
            "type": "Error"
        }
    },
    "0x4501207": {
        "vi": {
            "description": "Lấy thông tin các trường thuộc bảng thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Get information about fields in the success table",
            "type": "Success"
        }
    },
    "0x4501208": {
        "vi": {
            "description": "Cập nhật thông tin các trường thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successfully updated school information",
            "type": "Success"
        }
    },
    "0x4501209": {
        "vi": {
            "description": "Tồn tại ít nhất một trường không hợp lệ, các trường hợp lệ vẫn sẽ được cập nhật",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "If at least one invalid field exists, valid fields will still be updated",
            "type": "Warning"
        }
    },
    "0x4501210": {
        "vi": {
            "description": "Xóa trường thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successfully deleted the field",
            "type": "Success"
        }
    },
    "0x4501211": {
        "vi": {
            "description": "Không được bỏ trống danh sách id của các trường",
            "type": "Lỗi"
        },
        "en": {
            "description": "The list of field ids cannot be left blank",
            "type": "Error"
        }
    },
    "0x4501212": {
        "vi": {
            "description": "Bạn không thuộc dự án này",
            "type": "Lỗi"
        },
        "en": {
            "description": "You are not part of this project",
            "type": "Error"
        }
    },
    "0x4501213": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501214": {
        "vi": {
            "description": "Phiên bản không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Version does not exist",
            "type": "Error"
        }
    },
    "0x4501215": {
        "vi": {
            "description": "Mã phiên bản không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid version code",
            "type": "Error"
        }
    },
    "0x4501216": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501217": {
        "vi": {
            "description": "Tồn tại ít nhất một table không có liên kết khóa với phần còn lại",
            "type": "Lỗi"
        },
        "en": {
            "description": "There exists at least one table that has no key association with the rest",
            "type": "Error"
        }
    },
    "0x4501218": {
        "vi": {
            "description": "Tồn tại ít nhất một table không có khóa chính",
            "type": "Lỗi"
        },
        "en": {
            "description": "There exists at least one table that does not have a primary key",
            "type": "Error"
        }
    },
    "0x4501219": {
        "vi": {
            "description": "Tồn tại ít nhất một table id không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "At least one invalid table id exists",
            "type": "Error"
        }
    },
    "0x4501220": {
        "vi": {
            "description": "Ít nhất một field có id không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "At least one field with id does not exist",
            "type": "Error"
        }
    },
    "0x4501221": {
        "vi": {
            "description": "Ít nhất một field có id không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "At least one field has an invalid id",
            "type": "Error"
        }
    },
    "0x4501222": {
        "vi": {
            "description": "API không tồn tại hoặc đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "The API does not exist or has been removed",
            "type": "Error"
        }
    },
    "0x4501223": {
        "vi": {
            "description": "Tạo API thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "API created successfully",
            "type": "Success"
        }
    },
    "0x4501224": {
        "vi": {
            "description": "Cập nhật API thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "API update successful",
            "type": "Success"
        }
    },
    "0x4501225": {
        "vi": {
            "description": "Xóa API thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successfully deleted API",
            "type": "Success"
        }
    },
    "0x4501226": {
        "vi": {
            "description": "Bảng không hợp lệ  vì không có khóa chính ",
            "type": "Lỗi"
        },
        "en": {
            "description": "The table is invalid because it does not have a primary key",
            "type": "Error"
        }
    },
    "0x4501227": {
        "vi": {
            "description": "Bảng không hợp lệ vì không có trường nào khác ngoài khóa chính",
            "type": "Lỗi"
        },
        "en": {
            "description": "The table is invalid because there are no fields other than the primary key",
            "type": "Error"
        }
    },
    "0x4501228": {
        "vi": {
            "description": "Bảng không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Table does not exist",
            "type": "Error"
        }
    },
    "0x4501229": {
        "vi": {
            "description": "URL này đã tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "This URL already exists",
            "type": "Error"
        }
    },
    "0x4501230": {
        "vi": {
            "description": "Tham số không hợp lệ hoặc sai quy cách",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid or incorrect parameter",
            "type": "Error"
        }
    },
    "0x4501231": {
        "vi": {
            "description": "Tạo UI thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Created UI successfully",
            "type": "Success"
        }
    },
    "0x4501232": {
        "vi": {
            "description": "Cập nhật trạng thái UI thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Update UI status successfully",
            "type": "Success"
        }
    },
    "0x4501233": {
        "vi": {
            "description": "UI không tồn tại hoặc đã bị xóa",
            "type": "Lỗi"
        },
        "en": {
            "description": "UI does not exist or has been removed",
            "type": "Error"
        }
    },
    "0x4501234": {
        "vi": {
            "description": "Xóa UI thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successfully removed UI",
            "type": "Success"
        }
    },
    "0x4501235": {
        "vi": {
            "description": "Không được xóa trường khóa chính",
            "type": "Lỗi"
        },
        "en": {
            "description": "Do not delete the primary key field",
            "type": "Error"
        }
    },
    "0x4501236": {
        "vi": {
            "description": "Mã trường không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid field code",
            "type": "Error"
        }
    },
    "0x4501237": {
        "vi": {
            "description": "Token không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid token",
            "type": "Error"
        }
    },
    "0x4501238": {
        "vi": {
            "description": "Không có quyền tạo khóa ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Does not have permission to create keys",
            "type": "Error"
        }
    },
    "0x4501239": {
        "vi": {
            "description": "Khóa kích hoạt đã tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Activation key already exists",
            "type": "Error"
        }
    },
    "0x4501240": {
        "vi": {
            "description": "Tạo khóa kích hoạt thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Activation key generated successfully",
            "type": "Success"
        }
    },
    "0x4501241": {
        "vi": {
            "description": "Định dạng không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Invalid format",
            "type": "Error"
        }
    },
    "0x4501242": {
        "vi": {
            "description": "Bạn đã kích hoạt sản phẩm rồi",
            "type": "Cảnh báo"
        },
        "en": {
            "description": "You have already activated the product",
            "type": "Warning"
        }
    },
    "0x4501243": {
        "vi": {
            "description": "Khóa kích hoạt không hợp lệ",
            "type": "Lỗi"
        },
        "en": {
            "description": "Activation key is invalid",
            "type": "Error"
        }
    },
    "0x4501244": {
        "vi": {
            "description": "Kích hoạt khóa thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Key activation successful",
            "type": "Success"
        }
    },
    "0x4501245": {
        "vi": {
            "description": "Người quản lý dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project manager does not exist",
            "type": "Error"
        }
    },
    "0x4501246": {
        "vi": {
            "description": "Lỗi server, vui lòng liên hệ Quản trị viên để được hỗ trợ!",
            "type": "Lỗi"
        },
        "en": {
            "description": "Server error, please contact Administrator for support!",
            "type": "Error"
        }
    },
    "0x4501247": {
        "vi": {
            "description": "Dự án không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The project does not exist",
            "type": "Error"
        }
    },
    "0x4501248": {
        "vi": {
            "description": "Tên giai đoạn không hợp lệ hoặc rỗng",
            "type": "Lỗi"
        },
        "en": {
            "description": "Phase name is invalid or empty",
            "type": "Error"
        }
    },
    "0x4501249": {
        "vi": {
            "description": "Thông tin giai đoạn không hợp lệ hoặc rỗng.",
            "type": "Lỗi"
        },
        "en": {
            "description": "Phase information is invalid or empty.",
            "type": "Error"
        }
    },
    "0x4501250": {
        "vi": {
            "description": "Ngày bắt đầu không hợp lệ hoặc rỗng",
            "type": "Lỗi"
        },
        "en": {
            "description": "Start date is invalid or empty",
            "type": "Error"
        }
    },
    "0x4501251": {
        "vi": {
            "description": "Ngày kết thúc không hợp lệ hoặc rỗng",
            "type": "Lỗi"
        },
        "en": {
            "description": "End date is invalid or empty",
            "type": "Error"
        }
    },
    "0x4501252": {
        "vi": {
            "description": "Ngày kết thúc phải lớn hơn ngày bắt đầu",
            "type": "Lỗi"
        },
        "en": {
            "description": "The end date must be greater than the start date",
            "type": "Error"
        }
    },
    "0x4501253": {
        "vi": {
            "description": "Tạo Giai đoạn thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Create a Success Stage",
            "type": "Success"
        }
    },
    "0x4501254": {
        "vi": {
            "description": "Lấy thông tin các giai đoạn thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Get information about the stages of success",
            "type": "Success"
        }
    },
    "0x4501255": {
        "vi": {
            "description": "Giai đoạn không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "Phase does not exist",
            "type": "Error"
        }
    },
    "0x4501256": {
        "vi": {
            "description": "Lấy thông tin giai đoạn thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Get stage information successfully",
            "type": "Success"
        }
    },
    "0x4501257": {
        "vi": {
            "description": "Cập nhật giai đoạn thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Successful stage update",
            "type": "Success"
        }
    },
    "0x4501258": {
        "vi": {
            "description": "Xóa giai đoạn thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Delete stage successfully",
            "type": "Success"
        }
    },
    "0x4501259": {
        "vi": {
            "description": "Yêu cầu không tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The request does not exist",
            "type": "Error"
        }
    },
    "0x4501260": {
        "vi": {
            "description": "Xóa yêu cầu con thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Delete child request successfully",
            "type": "Success"
        }
    },
    "0x4501261": {
        "vi": {
            "description": "Cập nhật yêu cầu thành công",
            "type": "Thành công"
        },
        "en": {
            "description": "Update request successfully",
            "type": "Success"
        }
    },
    "0x4501262": {
        "vi": {
            "description": "Tên giai đoạn đã tồn tại",
            "type": "Lỗi"
        },
        "en": {
            "description": "The stage name already exists",
            "type": "Error"
        }
    }
}
  export default responseMessages;
  