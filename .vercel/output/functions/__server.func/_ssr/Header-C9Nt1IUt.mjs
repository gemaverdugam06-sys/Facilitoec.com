import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useAuth, u as useI18n, j as checkIsAdmin } from "./router-CStixWKO.mjs";
import { B as Button, c as cn } from "./button-DjOZMqFS.mjs";
import { L as Logo } from "./Logo-Dar0Ngh0.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2, L as Label2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { s as supabase } from "./client-Bvdk7TO_.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { G as Globe, B as Bell, P as Plus, U as User, e as MessageCircle, f as ShieldCheck, g as LogOut, C as ChevronRight, h as Check, i as Circle } from "../_libs/lucide-react.mjs";
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-auto" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator2, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = Separator2.displayName;
function useUnreadChats() {
  const { user } = useAuth();
  const [unread, setUnread] = reactExports.useState({});
  const [total, setTotal] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!user) {
      setUnread({});
      setTotal(0);
      return;
    }
    let alive = true;
    const compute = async () => {
      const { data: chats } = await supabase.from("chats").select("id, comprador_id, vendedor_id, ultimo_leido_comprador, ultimo_leido_vendedor").or(`comprador_id.eq.${user.id},vendedor_id.eq.${user.id}`);
      if (!chats || !alive) return;
      const counts = {};
      await Promise.all(
        chats.map(async (c) => {
          const after = c.comprador_id === user.id ? c.ultimo_leido_comprador : c.ultimo_leido_vendedor;
          const { count } = await supabase.from("mensajes").select("id", { count: "exact", head: true }).eq("chat_id", c.id).neq("remitente_id", user.id).gt("created_at", after ?? (/* @__PURE__ */ new Date(0)).toISOString());
          counts[c.id] = count ?? 0;
        })
      );
      if (!alive) return;
      setUnread(counts);
      setTotal(Object.values(counts).reduce((a, b) => a + b, 0));
    };
    compute();
    const topic = `unread:${user.id}:${Math.random().toString(36).slice(2)}`;
    const ch = supabase.channel(topic);
    ch.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "mensajes" },
      () => compute()
    );
    ch.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "chats" },
      () => compute()
    );
    ch.subscribe();
    return () => {
      alive = false;
      supabase.removeChannel(ch);
    };
  }, [user?.id]);
  return { unread, total };
}
function Header() {
  const { user, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { total: unread } = useUnreadChats();
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    checkIsAdmin(user.id).then(setIsAdmin);
  }, [user?.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.header,
    {
      initial: { y: -12, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.45, ease: "easeOut" },
      className: "sticky top-0 z-40 border-b bg-background/60 backdrop-blur-lg glass",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto flex h-16 items-center gap-3 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-9 w-9 drop-shadow-sm" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "logo-heading text-lg tracking-tight", children: [
            "FACILITO",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: "EC" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setLang(lang === "es" ? "en" : "es"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-semibold uppercase", children: lang })
          ] }),
          user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                variant: "ghost",
                size: "icon",
                className: "relative",
                "aria-label": t("chats"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/chats", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5" }),
                  unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground", children: unread > 99 ? "99+" : unread })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: { scale: 1.02 }, className: "will-change-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "btn-cta hover:opacity-95", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/publicar", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline ml-1", children: t("publish") })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", "aria-label": t("profile"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-52", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => navigate({ to: "/mis-publicaciones" }), children: t("my_listings") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => navigate({ to: "/perfil" }), children: t("profile") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => navigate({ to: "/chats" }), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mr-2 h-4 w-4" }),
                  " ",
                  t("chats"),
                  unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full bg-destructive px-2 text-[10px] font-bold text-destructive-foreground", children: unread })
                ] }),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: () => navigate({ to: "/admin" }), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mr-2 h-4 w-4 text-primary" }),
                    " Panel Admin"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  DropdownMenuItem,
                  {
                    onClick: async () => {
                      await signOut();
                      navigate({ to: "/" });
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                      " ",
                      t("sign_out")
                    ]
                  }
                )
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: { scale: 1.02 }, className: "will-change-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "btn-cta hover:opacity-95", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: t("sign_in") }) }) })
        ] })
      ] })
    }
  );
}
export {
  Header as H,
  useUnreadChats as u
};
