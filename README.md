# cing

命令行形式发送博客园（cnblogs）闪存

## 安装

```sh
npm i -g cing
```

## 使用

### 配置 cookie

- 用浏览器访问[https://ing.cnblogs.com/](https://ing.cnblogs.com/)，登录后按 F12 打开调试工具。
- 选中`Network`，
- 刷新页面
- 随便选一个链接
- 在`Request Headers`中复制`cookie`
- 配置`cookie`

```sh
cing init "<刚才复制的cookie>"
```

### 发送公开闪存

```sh
cing 这是公开闪存
```

### 发送私有闪存

```sh
cing -p 这是私有闪存
```
