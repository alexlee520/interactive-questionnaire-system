import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, UserPlus, Trash2 } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: "viewer" | "editor" | "admin";
}

interface Response {
  id: string;
  identity: string;
  cooperationIntention?: string;
  companyName?: string;
  contactName?: string;
  submittedAt: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "viewer" as "viewer" | "editor" | "admin",
  });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Check authentication
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      return response.json();
    },
    retry: false,
  });

  // Fetch responses
  const { data: responses, isLoading: responsesLoading } = useQuery<Response[]>({
    queryKey: ["admin-responses"],
    queryFn: async () => {
      const response = await fetch("/api/admin/responses");
      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }
      return response.json();
    },
    enabled: !!authData,
  });

  // Fetch users (admin only)
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
    enabled: !!authData && authData.user?.role === "admin",
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/login");
    },
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: async (userData: typeof newUser) => {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsAddUserOpen(false);
      setNewUser({ username: "", password: "", email: "", role: "viewer" });
      toast({
        title: "成功",
        description: "使用者已新增",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "新增失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await fetch(`/api/admin/users/${username}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "成功",
        description: "使用者已刪除",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "刪除失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ username, role }: { username: string; role: string }) => {
      const response = await fetch(`/api/admin/users/${username}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "成功",
        description: "角色已更新",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "更新失敗",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authData) {
      setLocation("/login");
    }
  }, [authData, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  if (!authData) {
    return null;
  }

  const isAdmin = authData.user?.role === "admin";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">管理後台</h1>
            <p className="text-muted-foreground mt-1">
              歡迎，{authData.user?.username} ({authData.user?.role})
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            登出
          </Button>
        </div>

        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="responses">問卷回覆</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">協作者管理</TabsTrigger>}
          </TabsList>

          <TabsContent value="responses" className="space-y-4">
            <div className="rounded-lg border">
              {responsesLoading ? (
                <div className="p-8 text-center">載入中...</div>
              ) : !responses || responses.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  目前沒有問卷回覆
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>提交時間</TableHead>
                      <TableHead>身份</TableHead>
                      <TableHead>公司名稱</TableHead>
                      <TableHead>聯絡人</TableHead>
                      <TableHead>合作意願</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell>
                          {new Date(response.submittedAt).toLocaleString("zh-TW")}
                        </TableCell>
                        <TableCell>
                          {response.identity === "potential" ? "潛在" : "已合作"}
                        </TableCell>
                        <TableCell>{response.companyName || "-"}</TableCell>
                        <TableCell>{response.contactName || "-"}</TableCell>
                        <TableCell>
                          {response.cooperationIntention === "yes"
                            ? "是"
                            : response.cooperationIntention === "no"
                            ? "否"
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">協作者管理</h2>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      新增協作者
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增協作者</DialogTitle>
                      <DialogDescription>
                        新增新的協作者帳號，設定權限等級
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-username">使用者名稱</Label>
                        <Input
                          id="new-username"
                          value={newUser.username}
                          onChange={(e) =>
                            setNewUser({ ...newUser, username: e.target.value })
                          }
                          placeholder="請輸入使用者名稱"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">密碼</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          placeholder="請輸入密碼"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input
                          id="new-email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="請輸入 Email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-role">角色</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value: "viewer" | "editor" | "admin") =>
                            setNewUser({ ...newUser, role: value })
                          }
                        >
                          <SelectTrigger id="new-role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer (檢視)</SelectItem>
                            <SelectItem value="editor">Editor (編輯)</SelectItem>
                            <SelectItem value="admin">Admin (管理員)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => addUserMutation.mutate(newUser)}
                        disabled={addUserMutation.isPending}
                      >
                        {addUserMutation.isPending ? "新增中..." : "新增"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-lg border">
                {usersLoading ? (
                  <div className="p-8 text-center">載入中...</div>
                ) : !users || users.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    目前沒有協作者
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>使用者名稱</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.username}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                updateRoleMutation.mutate({
                                  username: user.username,
                                  role: value,
                                })
                              }
                              disabled={user.username === authData.user?.username}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(user.username)}
                              disabled={
                                user.username === authData.user?.username ||
                                deleteUserMutation.isPending
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
