import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getContactInfoFn, type ContactInfo } from "@/lib/admin-server";

export type ContactData = {
  whatsapp_number: string;
  whatsapp_display: string;
  email_info: string;
  email_support: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
  twitter: string;
};

export const DEFAULT_CONTACT: ContactData = {
  whatsapp_number: "201011956363",
  whatsapp_display: "+20 101 195 6363",
  email_info: "info@qumraacademy.com",
  email_support: "support@qumraacademy.com",
  address: "30 N Gould St, STE 4257, Sheridan, United States",
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  tiktok: "",
  twitter: "",
};

let contactCache: ContactData = DEFAULT_CONTACT;

export function getCachedContact(): ContactData {
  return contactCache;
}

export function setContactCache(data: Partial<ContactInfo>) {
  contactCache = { ...DEFAULT_CONTACT, ...data };
}

const ContactContext = createContext<ContactData>(DEFAULT_CONTACT);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContactData>(DEFAULT_CONTACT);

  useEffect(() => {
    let alive = true;
    getContactInfoFn()
      .then((info) => {
        if (!alive || !info) return;
        const merged: ContactData = { ...DEFAULT_CONTACT };
        for (const [k, v] of Object.entries(info) as [keyof ContactData, string][]) {
          if (v) merged[k] = v;
        }
        setContactCache(merged);
        setData(merged);
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      alive = false;
    };
  }, []);

  return <ContactContext.Provider value={data}>{children}</ContactContext.Provider>;
}

export function useContact() {
  return useContext(ContactContext);
}
