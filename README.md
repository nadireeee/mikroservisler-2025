# 🛍️ ToyLand E-Commerce Microservices Platform

## 📋 İçindekiler
- [Proje Genel Bakış](#proje-genel-bakış)
- [Mimari Yapı](#mimari-yapı)
- [Teknolojiler](#teknolojiler)
- [Servisler](#servisler)
- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Geliştirme](#geliştirme)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Proje Genel Bakış

**ToyLand**, modern e-ticaret işlemlerini destekleyen kapsamlı bir mikroservis mimarisi platformudur. Bu proje, .NET 8, React, Docker ve çeşitli veritabanı teknolojilerini kullanarak ölçeklenebilir ve sürdürülebilir bir e-ticaret çözümü sunar.

### 🌟 Özellikler
- **🛡️ Güvenli Kimlik Doğrulama**: Duende IdentityServer ile JWT tabanlı authentication
- **🛒 Sepet Yönetimi**: Redis ile hızlı sepet işlemleri
- **📦 Sipariş Yönetimi**: Event-driven mimari ile sipariş işlemleri
- **🎉 İndirim Sistemi**: gRPC ile gerçek zamanlı indirim hesaplamaları
- **🎨 Modern UI**: React ile responsive web arayüzü
- **🚀 API Gateway**: YARP ile merkezi API yönetimi
- **📊 Veritabanı Çeşitliliği**: SQL Server, PostgreSQL, Redis

---

## 📋 Mimari Yapı

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Applications                    │
├─────────────────────────────────────────────────────────────┤
│  React App (6006)  │  .NET Web App (6008)  │  Mobile App   │
└─────────────────────┬───────────────────────┬───────────────┘
                      │                       │
┌─────────────────────▼───────────────────────▼───────────────┐
│                    API Gateway (6004)                       │
│                    (YARP Reverse Proxy)                     │
└─────────────────────┬───────────────────────┬───────────────┘
                      │                       │
┌─────────────────────▼───────────────────────▼───────────────┐
│              Microservices Layer                            │
├─────────────────────────────────────────────────────────────┤
│ Identity │ Catalog │ Basket │ Ordering │ Discount │ Payment │
│  (6007)  │  (6001) │ (6002) │  (6005)  │  (6003)  │  (TBD)  │
└──────────┴─────────┴────────┴──────────┴──────────┴─────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│ SQL Server │ PostgreSQL │ Redis │ RabbitMQ │ Event Store   │
│ (Identity) │ (Catalog)  │(Cache)│ (Events) │   (TBD)       │
└────────────┴────────────┴───────┴──────────┴───────────────┘
```

### 🔄 Event-Driven Architecture
- **Domain Events**: Sipariş oluşturma, ödeme tamamlama
- **Integration Events**: Servisler arası iletişim
- **Event Bus**: RabbitMQ ile event routing

---

## 📋 Teknolojiler

### Backend (.NET 8)
- **Framework**: .NET 8
- **Identity**: Duende IdentityServer 7
- **API Gateway**: YARP (Yet Another Reverse Proxy)
- **ORM**: Entity Framework Core 8
- **Messaging**: RabbitMQ
- **Caching**: Redis
- **gRPC**: .NET gRPC
- **Health Checks**: ASP.NET Core Health Checks
- **Logging**: Serilog

### Frontend
- **Framework**: React 18
- **State Management**: React Context API
- **Styling**: CSS3 with modern animations
- **HTTP Client**: Fetch API
- **Routing**: React Router v6

### Databases
- **SQL Server 2022**: Identity, Ordering, Discount services
- **PostgreSQL 15**: Catalog, Basket services
- **Redis 7**: Caching, Session storage
- **RabbitMQ 3**: Message broker

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose
- **Networking**: Custom Docker networks
- **Environment**: Development/Production configs

---

## 🏢 Servisler

### 1. 🛡️ Identity Service (Port: 6007)
**Kimlik doğrulama ve yetkilendirme merkezi**

#### Özellikler:
- **JWT Token Generation**: Güvenli token üretimi
- **User Management**: Kullanıcı kayıt/giriş yönetimi
- **Role-Based Access Control**: Rol tabanlı erişim kontrolü
- **Profile Management**: Kullanıcı profil yönetimi
- **Refresh Token**: Token yenileme mekanizması

#### Endpoints:
```
POST /api/account/login          - Kullanıcı girişi
POST /api/account/register       - Kullanıcı kaydı
GET  /api/account/profile        - Profil bilgileri
POST /api/account/logout         - Çıkış yapma
POST /api/account/refresh        - Token yenileme
```

#### Veritabanı: SQL Server (IdentityDb)

---

### 2. 📋 Catalog Service (Port: 6001)
**Ürün kataloğu yönetimi**

#### Özellikler:
- **Product Management**: Ürün CRUD işlemleri
- **Category Management**: Kategori yönetimi
- **Search & Filter**: Ürün arama ve filtreleme
- **Pagination**: Sayfalama desteği
- **Image Management**: Ürün görsel yönetimi

#### Endpoints:
```
GET    /api/products             - Tüm ürünler
GET    /api/products/{id}        - Ürün detayı
GET    /api/products/category/{category} - Kategori ürünleri
POST   /api/products             - Yeni ürün (Admin)
PUT    /api/products/{id}        - Ürün güncelleme (Admin)
DELETE /api/products/{id}        - Ürün silme (Admin)
```

#### Veritabanı: PostgreSQL (CatalogDb)

---

### 3. 🛒 Basket Service (Port: 6002)
**Sepet yönetimi ve işlemleri**

#### Özellikler:
- **Shopping Cart**: Sepet oluşturma ve yönetimi
- **Item Management**: Ürün ekleme/çıkarma
- **Price Calculation**: Fiyat hesaplamaları
- **Discount Integration**: İndirim entegrasyonu
- **Redis Caching**: Hızlı sepet işlemleri

#### Endpoints:
```
GET    /api/basket               - Sepet bilgileri
POST   /api/basket               - Sepet oluşturma
PUT    /api/basket               - Sepet güncelleme
DELETE /api/basket               - Sepet silme
POST   /api/basket/checkout      - Sipariş oluşturma
```

#### Veritabanı: PostgreSQL (BasketDb) + Redis (Cache)

---

### 4. 📦 Ordering Service (Port: 6005)
**Sipariş yönetimi ve işlemleri**

#### Özellikler:
- **Order Management**: Sipariş oluşturma ve takibi
- **Order History**: Sipariş geçmişi
- **Status Tracking**: Sipariş durumu takibi
- **Event Publishing**: Sipariş eventleri
- **CQRS Pattern**: Command/Query separation

#### Endpoints:
```
GET    /api/orders               - Tüm siparişler (Admin)
GET    /api/orders/customer/{id} - Müşteri siparişleri
POST   /api/orders               - Yeni sipariş
GET    /api/orders/{id}          - Sipariş detayı
DELETE /api/orders/{id}          - Sipariş silme (Admin)
```

#### Veritabanı: SQL Server (OrderingDb)

---

### 5. 🎉 Discount Service (Port: 6003)
**İndirim ve kupon yönetimi**

#### Özellikler:
- **Coupon Management**: Kupon oluşturma ve yönetimi
- **Discount Calculation**: İndirim hesaplamaları
- **gRPC Communication**: Hızlı servisler arası iletişim
- **Validation**: Kupon geçerlilik kontrolü

#### gRPC Methods:
```
GetDiscount(CouponRequest) -> CouponResponse
CreateDiscount(CouponRequest) -> CouponResponse
UpdateDiscount(CouponRequest) -> CouponResponse
DeleteDiscount(CouponRequest) -> CouponResponse
```

#### Veritabanı: SQL Server (DiscountDb)

---

### 6. 🚀 API Gateway (Port: 6004)
**Merkezi API yönetimi ve routing**

#### Özellikler:
- **Reverse Proxy**: Ters proxy işlemleri
- **Authentication**: JWT token doğrulama
- **Rate Limiting**: İstek sınırlama
- **Load Balancing**: Yük dengeleme
- **Request/Response Transformation**: İstek/yanıt dönüşümleri

#### Routes:
```
/identity-service/*  → Identity Service
/catalog-service/*   → Catalog Service
/basket-service/*    → Basket Service
/ordering-service/*  → Ordering Service
/discount-service/*  → Discount Service
```

---

### 7. 🎨 React Web App (Port: 6006)
**Modern web kullanıcı arayüzü**

#### Özellikler:
- **Responsive Design**: Mobil uyumlu tasarım
- **User Authentication**: Kullanıcı girişi/kaydı
- **Product Browsing**: Ürün görüntüleme
- **Shopping Cart**: Sepet yönetimi
- **Order Management**: Sipariş takibi
- **Profile Management**: Profil yönetimi

#### Pages:
- `/` - Ana sayfa
- `/products` - Ürünler
- `/product/:id` - Ürün detayı
- `/cart` - Sepet
- `/checkout` - Ödeme
- `/orders` - Siparişler
- `/profile` - Profil
- `/login` - Giriş
- `/register` - Kayıt

---

### 8. 📦 .NET Web App (Port: 6008)
**Alternatif web arayüzü**

#### Özellikler:
- **Razor Pages**: Server-side rendering
- **MVC Pattern**: Model-View-Controller
- **Traditional Web**: Geleneksel web uygulaması

---

## 🚀 Kurulum

### Gereksinimler
- **Docker Desktop**: 4.0+
- **Docker Compose**: 2.0+
- **Git**: 2.30+
- **RAM**: Minimum 8GB (16GB önerilen)
- **Disk**: Minimum 10GB boş alan

### Adım 1: Projeyi Klonlayın
```bash
git clone <repository-url>
cd yenir/4
```

### Adım 2: Environment Dosyalarını Hazırlayın
```bash
# .env dosyası oluşturun (opsiyonel)
cp .env.example .env
```

### Adım 3: Docker Compose ile Başlatın
```bash
# Tüm servisleri başlatın
docker-compose up -d

# Veya belirli servisleri başlatın
docker-compose up -d identity.api catalog.api basket.api ordering.api discount.grpc yarpapigateway shopping.react
```

### Adım 4: Servislerin Başlamasını Bekleyin
```bash
# Logları kontrol edin
docker-compose logs -f

# Servis durumunu kontrol edin
docker-compose ps
```

### Adım 5: Veritabanı Migration'larını Çalıştırın
```bash
# Identity Service migration'ları
docker-compose exec identity.api dotnet ef database update

# Diğer servisler için benzer komutlar
```

---

## 📖 Kullanım

### 📋 Web Uygulamalarına Erişim
- **React App**: http://localhost:6006
- **.NET Web App**: http://localhost:6008
- **API Gateway**: http://localhost:6004

### 📋 Varsayılan Kullanıcılar
```json
{
  "admin": {
    "username": "admin",
    "password": "Admin123!",
    "role": "admin"
  },
  "customer": {
    "username": "customer",
    "password": "Customer123!",
    "role": "customer"
  }
}
```

### 📋 E-ticaret İş Akışı
1. **Kayıt/Giriş**: http://localhost:6006/register veya /login
2. **Ürün Keşfi**: http://localhost:6006/products
3. **Sepete Ekleme**: Ürün detay sayfasından "Sepete Ekle"
4. **Sepet Yönetimi**: http://localhost:6006/cart
5. **Ödeme**: http://localhost:6006/checkout
6. **Sipariş Takibi**: http://localhost:6006/orders

---

## 📋 API Dokümantasyonu

### 📋 Authentication
Tüm API istekleri (public endpoint'ler hariç) JWT token gerektirir:

```bash
# Token alma
curl -X POST http://localhost:6004/identity-service/api/account/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'

# Token kullanımı
curl -X GET http://localhost:6004/catalog-service/api/products \
  -H "Authorization: Bearer <your-jwt-token>"
```

### 📦 Catalog API
```bash
# Tüm ürünler
GET /catalog-service/api/products

# Ürün detayı
GET /catalog-service/api/products/{id}

# Kategori ürünleri
GET /catalog-service/api/products/category/{category}
```

### 📋 Basket API
```bash
# Sepet bilgileri
GET /basket-service/api/basket

# Sepete ürün ekleme
POST /basket-service/api/basket
{
  "productId": "5334c996-8457-4cf0-815c-ed2b77c4ff61", // Squid Game 5 Taş Oyunu
  "quantity": 2
}

# Sipariş oluşturma
POST /basket-service/api/basket/checkout
{
  "firstName": "Ali",
  "lastName": "Veli",
  "email": "ali.veli@example.com",
  "address": "İstanbul, Kadıköy, Bahariye Cd. No:10"
}
```

### 📦 Ordering API
```bash
# Müşteri siparişleri
GET /ordering-service/api/orders/customer/{customerId}

# Sipariş detayı
GET /ordering-service/api/orders/{orderId}
```

---

## 🛠️ Geliştirme

### Proje Yapısı
```
4/
├── ApiGateways/
│   └── YarpApiGateway/          # API Gateway
├── BuildingBlocks/
│   ├── BuildingBlocks/          # Ortak kütüphaneler
│   └── BuildingBlocks.Messaging/ # Event messaging
├── Services/
│   ├── Identity/                # Identity Service
│   ├── Catalog/                 # Catalog Service
│   ├── Basket/                  # Basket Service
│   ├── Ordering/                # Ordering Service
│   └── Discount/                # Discount Service
├── WebApps/
│   ├── Shopping.React/          # React Web App
│   └── Shopping.Web/            # .NET Web App
├── docker-compose.yml           # Docker Compose
└── README.md                    # Bu dosya
```

### Geliştirme Ortamı Kurulumu
```bash
# 1. .NET 8 SDK kurulumu
# https://dotnet.microsoft.com/download/dotnet/8.0

# 2. Node.js 18+ kurulumu
# https://nodejs.org/

# 3. IDE kurulumu (Visual Studio 2022 veya VS Code)

# 4. Docker Desktop kurulumu
# https://www.docker.com/products/docker-desktop/
```

### Yerel Geliştirme
```bash
# 1. Sadece veritabanlarını başlatın
docker-compose up -d identitydb catalogdb basketdb orderingdb discountdb redis rabbitmq

# 2. Identity Service'i yerel çalıştırın
cd Services/Identity/Identity.API
dotnet run

# 3. Diğer servisleri benzer şekilde çalıştırın
```

### Debugging
```bash
# Container loglarını izleyin
docker-compose logs -f [service-name]

# Container'a bağlanın
docker-compose exec [service-name] bash

# Veritabanına bağlanın
docker-compose exec identitydb sqlcmd -S localhost -U sa -P SwN12345678
```

---

## 🚀 Deployment

### Production Deployment
```bash
# 1. Environment değişkenlerini ayarlayın
export ASPNETCORE_ENVIRONMENT=Production
export DOCKER_BUILDKIT=1

# 2. Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 3. Health check
curl http://localhost:6004/health
```

### Kubernetes Deployment (Gelecek)
```yaml
# Örnek Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: identity-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: identity-api
  template:
    metadata:
      labels:
        app: identity-api
    spec:
      containers:
      - name: identity-api
        image: toyland/identity-api:latest
        ports:
        - containerPort: 80
```

---

## 🔧 Troubleshooting

### Yaygın Sorunlar

#### 1. Port Çakışması
```bash
# Kullanılan portları kontrol edin
netstat -ano | findstr :6004

# Docker container'larını durdurun
docker-compose down
```

#### 2. Veritabanı Bağlantı Sorunu
```bash
# Veritabanı container'ının çalıştığını kontrol edin
docker-compose ps | grep db

# Veritabanı loglarını kontrol edin
docker-compose logs identitydb
```

#### 3. Identity Service Sorunları
```bash
# Identity Service loglarını kontrol edin
docker-compose logs identity.api

# Veritabanı migration'larını yeniden çalıştırın
docker-compose exec identity.api dotnet ef database update
```

#### 4. API Gateway Sorunları
```bash
# API Gateway loglarını kontrol edin
docker-compose logs yarpapigateway

# Route yapılandırmasını kontrol edin
curl http://localhost:6004/health
```

#### 5. React App Sorunları
```bash
# React container loglarını kontrol edin
docker-compose logs shopping.react

---

## Teknolojiler

- **Backend**: .NET 8, Entity Framework Core, Duende IdentityServer, RabbitMQ, Redis, gRPC, Serilog
- **Frontend**: React 18, Context API, CSS3, React Router
- **Databases**: SQL Server, PostgreSQL, Redis, RabbitMQ
- **DevOps**: Docker, Docker Compose

---

## Servisler

### Identity Service (6007)
- JWT Authentication, User Management, Role Management, Profile, Refresh Token

### Catalog Service (6001)
- Ürün CRUD, Kategori, Arama, Sayfalama

### Basket Service (6002)
- Sepet CRUD, Redis Cache, Discount entegrasyonu

### Ordering Service (6005)
- Sipariş CRUD, Sipariş geçmişi, Event publishing

### Discount Service (6003)
- Kupon/İndirim yönetimi, gRPC ile iletişim

### API Gateway (6004)
- Reverse Proxy, JWT doğrulama, Rate Limiting, Load Balancing

### React Web App (6006)
- Responsive UI, Auth, Sepet, Sipariş, Profil

---

## 📦 Örnek Ürünler

Aşağıda, sistemde yüklü gelen bazı örnek ürünler ve kategorileri listelenmiştir:

| Ürün Adı                                         | Açıklama                                                        | Fiyat    | Kategori         |
|--------------------------------------------------|-----------------------------------------------------------------|----------|------------------|
| Squid Game 5 Taş Oyunu                           | Squid Game 5 Taş Oyunu, Toyzzshop koleksiyonunun bir parçasıdır. Popüler dizinin oyuncuyla buluşan hali! | 149.99   | Kutu Oyunları    |
| Smile Games Günün Sorusu Kutu Oyunu              | Günlük sorularla eğlenceli zeka oyunu. Aile boyu keyifli vakit geçirmek için ideal. | 274.99   | Kutu Oyunları    |
| UNO Reverse Pack Eklenti Paketi                  | UNO Reverse Pack eklenti paketi ile oyuna yeni kurallar ve heyecan ekleyin! | 119.99   | Kutu Oyunları    |
| Bontempi Işıklı Mikrofonlu Elektronik Tabureli Org | Işıklı ve mikrofonlu elektronik org. Çocuklar için mükemmel müzik deneyimi. | 2699.00  | Müzik Aletleri   |
| Fisher Price Matematikçi Timsah                  | Matematik öğrenmeyi eğlenceli hale getiren interaktif timsah oyuncak. | 1399.99  | Eğitici Oyuncaklar|
| Marvel Spiderman İngilizce Türkçe Laptop         | Spiderman temalı eğitici laptop. İngilizce ve Türkçe öğrenme.   | 2799.99  | Eğitici Oyuncaklar|

> Tüm örnek ürünler için: `Services/Catalog/Catalog.API/Data/CatalogInitialData.cs` dosyasına bakabilirsiniz.

---
