import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { checkIsAdmin } from "@/lib/auth-utils";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Plus, MessageCircle, User, LogOut, Globe, ShieldCheck, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUnreadChats } from "@/hooks/use-unread";

export function Header() {
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { total: unread } = useUnreadChats();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    checkIsAdmin(user.id).then(setIsAdmin);
  }, [user?.id]);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur-lg glass"
    >
      <div className="container mx-auto flex h-16 items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <Logo className="h-9 w-9 drop-shadow-sm" />
          <span className="logo-heading text-lg tracking-tight">
            FACILITO<span className="text-gradient-primary">EC</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setLang(lang === "es" ? "en" : "es")}>
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs font-semibold uppercase">{lang}</span>
          </Button>

          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={t("chats")}
              >
                <Link to="/chats">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </Link>
              </Button>

              <motion.div whileHover={{ scale: 1.02 }} className="will-change-transform">
                <Button asChild className="btn-cta hover:opacity-95">
                  <Link to="/publicar">
                    <Plus className="h-4 w-4" />{" "}
                    <span className="hidden sm:inline ml-1">{t("publish")}</span>
                  </Link>
                </Button>
              </motion.div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label={t("profile")}>
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => navigate({ to: "/mis-publicaciones" })}>
                    {t("my_listings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/perfil" })}>
                    {t("profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/chats" })}>
                    <MessageCircle className="mr-2 h-4 w-4" /> {t("chats")}
                    {unread > 0 && (
                      <span className="ml-auto rounded-full bg-destructive px-2 text-[10px] font-bold text-destructive-foreground">
                        {unread}
                      </span>
                    )}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                        <ShieldCheck className="mr-2 h-4 w-4 text-primary" /> Panel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> {t("sign_out")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
              <motion.div whileHover={{ scale: 1.02 }} className="will-change-transform">
                <Button asChild className="btn-cta hover:opacity-95">
                  <Link to="/auth">{t("sign_in")}</Link>
                </Button>
              </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
