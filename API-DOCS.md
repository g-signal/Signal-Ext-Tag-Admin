# Signal Ext Tag Admin API 接口文档

## 基础信息

- **基础URL**: `http://localhost:65535`
- **Content-Type**: `application/json`
- **响应格式**: 统一JSON格式

### 通用响应格式

**成功响应**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 123,
  "errorCode": 0,
  "errorMsg": "success",
  "data": {}
}
```

**错误响应**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 123,
  "errorCode": 400,
  "errorMsg": "请求参数错误",
  "data": null
}
```

---

## 1. 标签管理 API

### 1.1 创建标签

**请求**
- **URL**: `POST /api/signal/tags`
- **Content-Type**: `application/json`

**请求参数**
```json
{
  "name": "标签名称",
  "type": 0,
  "text": "文本内容",
  "imgBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "backgroundColor": "#ffffff",
  "color": "#333333",
  "opacity": 0.8,
  "borderWidth": 2,
  "borderRadius": 5,
  "borderColor": "#cccccc",
  "borderStyle": "solid",
  "priority": 0
}
```

**参数说明**
- `name`: 标签名称（可选）
- `type`: 标签类型，0-文本，1-图片，**必填**
- `text`: 文本内容（type=0时使用）
- `imgBase64`: base64编码的图片数据，包含完整的data URL（type=1时使用）
- `backgroundColor`: 背景颜色（hex格式，如 #ffffff）
- `color`: 文字颜色（hex格式，如 #333333）
- `opacity`: 透明度（0.0-1.0，浮点数）
- `borderWidth`: 边框宽度（像素，整数）
- `borderRadius`: 边框圆角（像素，整数）
- `borderColor`: 边框颜色（hex格式）
- `borderStyle`: 边框样式（solid/dashed/dotted/double/groove/ridge/inset/outset/none/hidden）
- `priority`: 优先级（≥0，0最高优先级）

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 45,
  "errorCode": 0,
  "errorMsg": "success",
  "data": {
    "id": 1773234567890123456,
    "name": "重要",
    "type": 0,
    "text": "重要",
    "imgBase64": null,
    "backgroundColor": "#ff0000",
    "color": "#ffffff",
    "opacity": 1.0,
    "borderWidth": null,
    "borderRadius": null,
    "borderColor": null,
    "borderStyle": null,
    "priority": 0
  }
}
```

### 1.2 更新标签

**请求**
- **URL**: `PUT /api/signal/tags/{id}`
- **Content-Type**: `application/json`

**路径参数**
- `id`: 标签ID（Long类型的雪花ID）

**请求体**
```json
{
  "name": "更新的标签名称",
  "type": 1,
  "text": null,
  "imgBase64": "data:image/png;base64,newImageData...",
  "backgroundColor": "#00ff00",
  "color": "#000000",
  "opacity": 0.9,
  "borderWidth": 1,
  "borderRadius": 8,
  "borderColor": "#0066cc",
  "borderStyle": "dashed",
  "priority": 1
}
```

**说明**: 只有提供的字段会被更新，null值的字段保持不变

### 1.3 删除标签

**请求**
- **URL**: `DELETE /api/signal/tags/{id}`

**路径参数**
- `id`: 标签ID（Long）

**注意**: 删除标签会自动删除所有用户和群组与该标签的关联关系

### 1.4 获取标签列表

**请求**
- **URL**: `GET /api/signal/tags`

**查询参数**
- `page`: 页码，默认1
- `size`: 每页数量，默认20，最大100

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 23,
  "errorCode": 0,
  "errorMsg": "success",
  "data": [
    {
      "id": 1773234567890123456,
      "name": "重要",
      "type": 0,
      "text": "重要",
      "imgBase64": null,
      "backgroundColor": "#ff0000",
      "color": "#ffffff",
      "opacity": 1.0,
      "borderWidth": 2,
      "borderRadius": 4,
      "borderColor": "#cc0000",
      "borderStyle": "solid",
      "priority": 0
    },
    {
      "id": 1773234567890123457,
      "name": "图片标签",
      "type": 1,
      "text": null,
      "imgBase64": "data:image/png;base64,iVBORw0KGgoAAAA...",
      "backgroundColor": null,
      "color": null,
      "opacity": null,
      "borderWidth": null,
      "borderRadius": null,
      "borderColor": null,
      "borderStyle": null,
      "priority": 1
    }
  ]
}
```

---

## 2. 用户管理 API

### 2.1 创建用户

**请求**
- **URL**: `POST /api/signal/users`
- **Content-Type**: `application/json`

**请求参数**
```json
{
  "id": "user123456",
  "phoneNumber": "+8613800138000",
  "remark": "这是一个测试用户",
  "tagIds": [1773234567890123456, 1773234567890123457]
}
```

**参数说明**
- `id`: 用户ID，**必填**，字符串类型，建议使用Signal用户的唯一标识
- `phoneNumber`: 手机号码，建议包含国际区号
- `remark`: 用户备注，最大255字符
- `tagIds`: 关联的标签ID数组，可选

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 67,
  "errorCode": 0,
  "errorMsg": "success",
  "data": {
    "id": "user123456",
    "phoneNumber": "+8613800138000",
    "remark": "这是一个测试用户",
    "createTime": "2024-03-10T10:00:00",
    "updateTime": "2024-03-10T10:00:00",
    "tags": [
      {
        "id": 1773234567890123456,
        "name": "重要",
        "type": 0,
        "text": "重要",
        "backgroundColor": "#ff0000",
        "color": "#ffffff",
        "priority": 0
      }
    ]
  }
}
```

### 2.2 更新用户

**请求**
- **URL**: `PUT /api/signal/users/{id}`
- **Content-Type**: `application/json`

**路径参数**
- `id`: 用户ID（String）

**请求体**
```json
{
  "phoneNumber": "+8613800138001",
  "remark": "更新的用户备注",
  "tagIds": [1773234567890123456]
}
```

**说明**:
- 只有提供的字段会被更新
- `tagIds`如果提供，会完全替换现有的标签关联关系
- `tagIds`如果为空数组，会删除所有标签关联
- `tagIds`如果不提供，标签关联保持不变

### 2.3 删除用户

**请求**
- **URL**: `DELETE /api/signal/users/{id}`

**路径参数**
- `id`: 用户ID（String）

**注意**: 删除用户会自动删除该用户的所有标签关联关系

### 2.4 获取用户列表

**请求**
- **URL**: `GET /api/signal/users`

**查询参数**
- `page`: 页码，默认1
- `size`: 每页数量，默认20，最大100

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 89,
  "errorCode": 0,
  "errorMsg": "success",
  "data": [
    {
      "id": "user123456",
      "phoneNumber": "+8613800138000",
      "remark": "用户备注",
      "createTime": "2024-03-10T10:00:00",
      "updateTime": "2024-03-10T10:00:00",
      "tags": [
        {
          "id": 1773234567890123456,
          "name": "重要",
          "type": 0,
          "text": "重要",
          "backgroundColor": "#ff0000",
          "color": "#ffffff",
          "opacity": 1.0,
          "priority": 0
        }
      ]
    }
  ]
}
```

---

## 3. 群组管理 API

### 3.1 创建群组

**请求**
- **URL**: `POST /api/signal/groups`
- **Content-Type**: `application/json`

**请求参数**
```json
{
  "id": "group123456",
  "remark": "这是一个测试群组",
  "tagIds": [1773234567890123456]
}
```

**参数说明**
- `id`: 群组ID，**必填**，字符串类型，建议使用Signal群组的唯一标识
- `remark`: 群组备注，最大255字符
- `tagIds`: 关联的标签ID数组，可选

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 56,
  "errorCode": 0,
  "errorMsg": "success",
  "data": {
    "id": "group123456",
    "remark": "这是一个测试群组",
    "createTime": "2024-03-10T10:00:00",
    "updateTime": "2024-03-10T10:00:00",
    "tags": [
      {
        "id": 1773234567890123456,
        "name": "重要",
        "type": 0,
        "text": "重要",
        "backgroundColor": "#ff0000",
        "color": "#ffffff",
        "priority": 0
      }
    ]
  }
}
```

### 3.2 更新群组

**请求**
- **URL**: `PUT /api/signal/groups/{id}`
- **Content-Type**: `application/json`

**路径参数**
- `id`: 群组ID（String）

**请求体**
```json
{
  "remark": "更新的群组备注",
  "tagIds": [1773234567890123456, 1773234567890123457]
}
```

### 3.3 删除群组

**请求**
- **URL**: `DELETE /api/signal/groups/{id}`

**路径参数**
- `id`: 群组ID（String）

### 3.4 获取群组列表

**请求**
- **URL**: `GET /api/signal/groups`

**查询参数**
- `page`: 页码，默认1
- `size`: 每页数量，默认20，最大100

**响应示例**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 78,
  "errorCode": 0,
  "errorMsg": "success",
  "data": [
    {
      "id": "group123456",
      "remark": "群组备注",
      "createTime": "2024-03-10T10:00:00",
      "updateTime": "2024-03-10T10:00:00",
      "tags": [
        {
          "id": 1773234567890123456,
          "name": "重要",
          "type": 0,
          "text": "重要",
          "backgroundColor": "#ff0000",
          "color": "#ffffff",
          "opacity": 1.0,
          "priority": 0
        }
      ]
    }
  ]
}
```

---

## 4. 错误码说明

| 错误码 | 说明 | 示例场景 |
|-------|------|----------|
| 0     | 成功 | 请求处理成功 |
| 400   | 请求参数错误 | 必填参数缺失、参数格式错误 |
| 404   | 资源不存在 | 请求的用户/群组/标签不存在 |
| 500   | 服务器内部错误 | 数据库连接失败、系统异常 |

**常见错误响应示例**

**参数验证失败**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 12,
  "errorCode": 400,
  "errorMsg": "用户ID不能为空",
  "data": null
}
```

**资源不存在**
```json
{
  "systemTime": "2024-03-10T10:00:00.000Z",
  "usedTime": 8,
  "errorCode": 404,
  "errorMsg": "标签不存在",
  "data": null
}
```

---

## 5. 使用示例

### 创建文本标签
```bash
curl -X POST http://localhost:65535/api/signal/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "重要",
    "type": 0,
    "text": "重要",
    "backgroundColor": "#ff0000",
    "color": "#ffffff",
    "opacity": 1.0,
    "borderWidth": 2,
    "borderRadius": 4,
    "borderColor": "#cc0000",
    "borderStyle": "solid",
    "priority": 0
  }'
```

### 创建图片标签
```bash
curl -X POST http://localhost:65535/api/signal/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "图片标签",
    "type": 1,
    "imgBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "priority": 1
  }'
```

### 创建带标签的用户
```bash
curl -X POST http://localhost:65535/api/signal/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user123456",
    "phoneNumber": "+8613800138000",
    "remark": "测试用户",
    "tagIds": [1773234567890123456]
  }'
```

### 更新用户标签
```bash
curl -X PUT http://localhost:65535/api/signal/users/user123456 \
  -H "Content-Type: application/json" \
  -d '{
    "remark": "更新的备注",
    "tagIds": [1773234567890123456, 1773234567890123457]
  }'
```

### 获取标签列表
```bash
curl -X GET "http://localhost:65535/api/signal/tags?page=1&size=10"
```

---

## 6. 注意事项

### 6.1 标签设计说明
- **文本标签**: 设置 `type=0`，使用 `text` 字段存储显示文本，可设置各种样式属性
- **图片标签**: 设置 `type=1`，使用 `imgBase64` 字段存储base64图片数据
- **优先级**: `priority` 字段控制显示顺序，数值越小优先级越高
- **样式属性**: 透明度、边框、颜色等属性都是可选的，可以实现丰富的视觉效果

### 6.2 标签关联说明
- 用户和群组都可以关联多个标签
- 创建/更新时可以一次性设置标签关联
- 删除标签会自动删除所有相关的关联关系
- 删除用户/群组会自动删除其标签关联关系

### 6.3 分页说明
- 所有列表接口都支持分页
- `page` 从1开始计数
- `size` 最大值为100，超过会被限制为100

### 6.4 ID生成说明
- 标签ID使用雪花算法生成，保证全局唯一且趋势递增
- 用户ID和群组ID由客户端提供，建议使用Signal的唯一标识

---

## 7. 数据库信息

- **数据库**: MySQL 8.0+
- **字符集**: utf8mb4_0900_ai_ci
- **连接地址**: bison_db:3306 (Docker容器环境)
- **数据库名**: signal_ext_tag
- **用户名**: bison
- **密码**: !QAZ2wsx3edc