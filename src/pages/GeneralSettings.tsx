import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Key, Save, Loader2, Settings, Palette } from "lucide-react";

const TIMEZONES = [
  "UTC",
  "Africa/Abidjan","Africa/Accra","Africa/Addis_Ababa","Africa/Algiers","Africa/Asmara","Africa/Bamako","Africa/Bangui","Africa/Banjul","Africa/Bissau","Africa/Blantyre","Africa/Brazzaville","Africa/Bujumbura","Africa/Cairo","Africa/Casablanca","Africa/Ceuta","Africa/Conakry","Africa/Dakar","Africa/Dar_es_Salaam","Africa/Djibouti","Africa/Douala","Africa/El_Aaiun","Africa/Freetown","Africa/Gaborone","Africa/Harare","Africa/Johannesburg","Africa/Juba","Africa/Kampala","Africa/Khartoum","Africa/Kigali","Africa/Kinshasa","Africa/Lagos","Africa/Libreville","Africa/Lome","Africa/Luanda","Africa/Lubumbashi","Africa/Lusaka","Africa/Malabo","Africa/Maputo","Africa/Maseru","Africa/Mbabane","Africa/Mogadishu","Africa/Monrovia","Africa/Nairobi","Africa/Ndjamena","Africa/Niamey","Africa/Nouakchott","Africa/Ouagadougou","Africa/Porto-Novo","Africa/Sao_Tome","Africa/Tripoli","Africa/Tunis","Africa/Windhoek",
  "America/Adak","America/Anchorage","America/Anguilla","America/Antigua","America/Araguaina","America/Argentina/Buenos_Aires","America/Argentina/Catamarca","America/Argentina/Cordoba","America/Argentina/Jujuy","America/Argentina/La_Rioja","America/Argentina/Mendoza","America/Argentina/Rio_Gallegos","America/Argentina/Salta","America/Argentina/San_Juan","America/Argentina/San_Luis","America/Argentina/Tucuman","America/Argentina/Ushuaia","America/Aruba","America/Asuncion","America/Atikokan","America/Bahia","America/Bahia_Banderas","America/Barbados","America/Belem","America/Belize","America/Blanc-Sablon","America/Boa_Vista","America/Bogota","America/Boise","America/Cambridge_Bay","America/Campo_Grande","America/Cancun","America/Caracas","America/Cayenne","America/Cayman","America/Chicago","America/Chihuahua","America/Ciudad_Juarez","America/Costa_Rica","America/Coyhaique","America/Creston","America/Cuiaba","America/Curacao","America/Danmarkshavn","America/Dawson","America/Dawson_Creek","America/Denver","America/Detroit","America/Dominica","America/Edmonton","America/Eirunepe","America/El_Salvador","America/Fort_Nelson","America/Fortaleza","America/Glace_Bay","America/Goose_Bay","America/Grand_Turk","America/Grenada","America/Guadeloupe","America/Guatemala","America/Guayaquil","America/Guyana","America/Halifax","America/Havana","America/Hermosillo","America/Indiana/Indianapolis","America/Indiana/Knox","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Tell_City","America/Indiana/Vevay","America/Indiana/Vincennes","America/Indiana/Winamac","America/Inuvik","America/Iqaluit","America/Jamaica","America/Juneau","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Kralendijk","America/La_Paz","America/Lima","America/Los_Angeles","America/Lower_Princes","America/Maceio","America/Managua","America/Manaus","America/Marigot","America/Martinique","America/Matamoros","America/Mazatlan","America/Menominee","America/Merida","America/Metlakatla","America/Mexico_City","America/Miquelon","America/Moncton","America/Monterrey","America/Montevideo","America/Montserrat","America/Nassau","America/New_York","America/Nome","America/Noronha","America/North_Dakota/Beulah","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/Nuuk","America/Ojinaga","America/Panama","America/Paramaribo","America/Phoenix","America/Port-au-Prince","America/Port_of_Spain","America/Porto_Velho","America/Puerto_Rico","America/Punta_Arenas","America/Rankin_Inlet","America/Recife","America/Regina","America/Resolute","America/Rio_Branco","America/Santarem","America/Santiago","America/Santo_Domingo","America/Sao_Paulo","America/Scoresbysund","America/Sitka","America/St_Barthelemy","America/St_Johns","America/St_Kitts","America/St_Lucia","America/St_Thomas","America/St_Vincent","America/Swift_Current","America/Tegucigalpa","America/Thule","America/Tijuana","America/Toronto","America/Tortola","America/Vancouver","America/Whitehorse","America/Winnipeg","America/Yakutat",
  "Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Macquarie","Antarctica/Mawson","Antarctica/McMurdo","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok",
  "Arctic/Longyearbyen",
  "Asia/Aden","Asia/Almaty","Asia/Amman","Asia/Anadyr","Asia/Aqtau","Asia/Aqtobe","Asia/Ashgabat","Asia/Atyrau","Asia/Baghdad","Asia/Bahrain","Asia/Baku","Asia/Bangkok","Asia/Barnaul","Asia/Beirut","Asia/Bishkek","Asia/Brunei","Asia/Chita","Asia/Colombo","Asia/Damascus","Asia/Dhaka","Asia/Dili","Asia/Dubai","Asia/Dushanbe","Asia/Famagusta","Asia/Gaza","Asia/Hebron","Asia/Ho_Chi_Minh","Asia/Hong_Kong","Asia/Hovd","Asia/Irkutsk","Asia/Jakarta","Asia/Jayapura","Asia/Jerusalem","Asia/Kabul","Asia/Kamchatka","Asia/Karachi","Asia/Kathmandu","Asia/Khandyga","Asia/Kolkata","Asia/Krasnoyarsk","Asia/Kuala_Lumpur","Asia/Kuching","Asia/Kuwait","Asia/Macau","Asia/Magadan","Asia/Makassar","Asia/Manila","Asia/Muscat","Asia/Nicosia","Asia/Novokuznetsk","Asia/Novosibirsk","Asia/Omsk","Asia/Oral","Asia/Phnom_Penh","Asia/Pontianak","Asia/Pyongyang","Asia/Qatar","Asia/Qostanay","Asia/Qyzylorda","Asia/Riyadh","Asia/Sakhalin","Asia/Samarkand","Asia/Seoul","Asia/Shanghai","Asia/Singapore","Asia/Srednekolymsk","Asia/Taipei","Asia/Tashkent","Asia/Tbilisi","Asia/Tehran","Asia/Thimphu","Asia/Tokyo","Asia/Tomsk","Asia/Ulaanbaatar","Asia/Urumqi","Asia/Ust-Nera","Asia/Vientiane","Asia/Vladivostok","Asia/Yakutsk","Asia/Yangon","Asia/Yekaterinburg","Asia/Yerevan",
  "Atlantic/Azores","Atlantic/Bermuda","Atlantic/Canary","Atlantic/Cape_Verde","Atlantic/Faroe","Atlantic/Madeira","Atlantic/Reykjavik","Atlantic/South_Georgia","Atlantic/St_Helena","Atlantic/Stanley",
  "Australia/Adelaide","Australia/Brisbane","Australia/Broken_Hill","Australia/Darwin","Australia/Eucla","Australia/Hobart","Australia/Lindeman","Australia/Lord_Howe","Australia/Melbourne","Australia/Perth","Australia/Sydney",
  "Europe/Amsterdam","Europe/Andorra","Europe/Astrakhan","Europe/Athens","Europe/Belgrade","Europe/Berlin","Europe/Bratislava","Europe/Brussels","Europe/Bucharest","Europe/Budapest","Europe/Busingen","Europe/Chisinau","Europe/Copenhagen","Europe/Dublin","Europe/Gibraltar","Europe/Guernsey","Europe/Helsinki","Europe/Isle_of_Man","Europe/Istanbul","Europe/Jersey","Europe/Kaliningrad","Europe/Kirov","Europe/Kyiv","Europe/Lisbon","Europe/Ljubljana","Europe/London","Europe/Luxembourg","Europe/Madrid","Europe/Malta","Europe/Mariehamn","Europe/Minsk","Europe/Monaco","Europe/Moscow","Europe/Oslo","Europe/Paris","Europe/Podgorica","Europe/Prague","Europe/Riga","Europe/Rome","Europe/Samara","Europe/San_Marino","Europe/Sarajevo","Europe/Saratov","Europe/Simferopol","Europe/Skopje","Europe/Sofia","Europe/Stockholm","Europe/Tallinn","Europe/Tirane","Europe/Ulyanovsk","Europe/Vaduz","Europe/Vatican","Europe/Vienna","Europe/Vilnius","Europe/Volgograd","Europe/Warsaw","Europe/Zagreb","Europe/Zurich",
  "Indian/Antananarivo","Indian/Chagos","Indian/Christmas","Indian/Cocos","Indian/Comoro","Indian/Kerguelen","Indian/Mahe","Indian/Maldives","Indian/Mauritius","Indian/Mayotte","Indian/Reunion",
  "Pacific/Apia","Pacific/Auckland","Pacific/Bougainville","Pacific/Chatham","Pacific/Chuuk","Pacific/Easter","Pacific/Efate","Pacific/Fakaofo","Pacific/Fiji","Pacific/Funafuti","Pacific/Galapagos","Pacific/Gambier","Pacific/Guadalcanal","Pacific/Guam","Pacific/Honolulu","Pacific/Kanton","Pacific/Kiritimati","Pacific/Kosrae","Pacific/Kwajalein","Pacific/Majuro","Pacific/Marquesas","Pacific/Midway","Pacific/Nauru","Pacific/Niue","Pacific/Norfolk","Pacific/Noumea","Pacific/Pago_Pago","Pacific/Palau","Pacific/Pitcairn","Pacific/Pohnpei","Pacific/Port_Moresby","Pacific/Rarotonga","Pacific/Saipan","Pacific/Tahiti","Pacific/Tarawa","Pacific/Tongatapu","Pacific/Wake","Pacific/Wallis",
];

const OPENAI_MODELS = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4.1", label: "GPT-4.1" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "o4-mini", label: "O4 Mini" },
  { value: "gpt-5", label: "GPT-5" },
  { value: "gpt-5-mini", label: "GPT-5 Mini" },
  { value: "gpt-5-nano", label: "GPT-5 Nano" },
  { value: "gpt-5-pro", label: "GPT-5 Pro" },
];

const ENGINE_OPTIONS = [
  { value: "gemini", label: "Gemini Model" },
  { value: "openai", label: "OpenAI Model" },
];

const RECORDS_OPTIONS = [
  { value: "20", label: "20 items per page" },
  { value: "50", label: "50 items per page" },
  { value: "100", label: "100 items per page" },
];

const CURRENCY_FORMAT_OPTIONS = [
  { value: "both", label: "Show Currency Text and Symbol Both" },
  { value: "text", label: "Show Currency Text Only" },
  { value: "symbol", label: "Show Currency Symbol Only" },
];

const API_KEY_FIELDS = [
  { key: "GEMINI_API_KEY", label: "Gemini API Key", icon: "💎" },
  { key: "OPENAI_API_KEY", label: "OpenAI API Key", icon: "🤖" },
  { key: "CLAUDE_API_KEY", label: "Claude API Key", icon: "🧠" },
  { key: "DEEPSEEK_API_KEY", label: "DeepSeek API Key", icon: "🔍" },
];

const GeneralSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("setting_key, setting_value");
      if (error) throw error;
      const map: Record<string, string> = {};
      data?.forEach((s) => {
        map[s.setting_key] = s.setting_value;
      });
      setSettings(map);
    } catch (error: any) {
      toast.error("Failed to load settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("settings")
          .update({ setting_value: value })
          .eq("setting_key", key);
        if (error) throw error;
      }
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          General Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage site configuration, API keys, and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* General Site Settings */}
        <div className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3">
            General Setting
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Site Title</Label>
              <Input
                value={settings.SITE_TITLE || ""}
                onChange={(e) => updateSetting("SITE_TITLE", e.target.value)}
                placeholder="Enter site title..."
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Currency</Label>
              <Input
                value={settings.CURRENCY || ""}
                onChange={(e) => updateSetting("CURRENCY", e.target.value)}
                placeholder="e.g. USD, EUR, BDT"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Currency Symbol</Label>
              <Input
                value={settings.CURRENCY_SYMBOL || ""}
                onChange={(e) => updateSetting("CURRENCY_SYMBOL", e.target.value)}
                placeholder="e.g. $, €, ৳"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Timezone</Label>
              <Select
                value={settings.TIMEZONE || "UTC"}
                onValueChange={(v) => updateSetting("TIMEZONE", v)}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Site Base Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={settings.SITE_BASE_COLOR || "#4f46e5"}
                  onChange={(e) => updateSetting("SITE_BASE_COLOR", e.target.value)}
                  className="w-14 h-10 p-1 bg-secondary border-border cursor-pointer"
                />
                <Input
                  value={settings.SITE_BASE_COLOR || "#4f46e5"}
                  onChange={(e) => updateSetting("SITE_BASE_COLOR", e.target.value)}
                  className="bg-secondary border-border text-foreground flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium">Record to Display Per Page</Label>
              <Select
                value={settings.RECORDS_PER_PAGE || "20"}
                onValueChange={(v) => updateSetting("RECORDS_PER_PAGE", v)}
              >
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RECORDS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Currency Showing Format</Label>
            <Select
              value={settings.CURRENCY_FORMAT || "both"}
              onValueChange={(v) => updateSetting("CURRENCY_FORMAT", v)}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* API Flash Access Key */}
        <div className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3">
            API Flash Access Key
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground text-sm font-medium">API Flash Access Key</Label>
              <a
                href="https://apiflash.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                Get API Key →
              </a>
            </div>
            <div className="relative">
              <Input
                type={visibility.API_FLASH_ACCESS_KEY ? "text" : "password"}
                value={settings.API_FLASH_ACCESS_KEY || ""}
                onChange={(e) => updateSetting("API_FLASH_ACCESS_KEY", e.target.value)}
                placeholder="Enter API Flash access key..."
                className="bg-secondary border-border text-foreground pr-10"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("API_FLASH_ACCESS_KEY")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {visibility.API_FLASH_ACCESS_KEY ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Default Engine & Model Selection */}
        <div className="glass-card rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            AI Engine & API Keys
          </h2>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">Select Default Engine for API Key</Label>
            <Select
              value={settings.DEFAULT_ENGINE || ""}
              onValueChange={(v) => updateSetting("DEFAULT_ENGINE", v)}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select one model" />
              </SelectTrigger>
              <SelectContent>
                {ENGINE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-5">
            {API_KEY_FIELDS.map((apiKey) => (
              <div key={apiKey.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <span>{apiKey.icon}</span>
                    {apiKey.label}
                  </Label>
                  <a
                    href={
                      apiKey.key === "OPENAI_API_KEY"
                        ? "https://platform.openai.com/api-keys"
                        : apiKey.key === "GEMINI_API_KEY"
                        ? "https://aistudio.google.com/app/apikey"
                        : apiKey.key === "CLAUDE_API_KEY"
                        ? "https://console.anthropic.com/settings/keys"
                        : "https://platform.deepseek.com/api_keys"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Get API Key →
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type={visibility[apiKey.key] ? "text" : "password"}
                    value={settings[apiKey.key] || ""}
                    onChange={(e) => updateSetting(apiKey.key, e.target.value)}
                    placeholder={`Enter your ${apiKey.label}...`}
                    className="bg-secondary border-border text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(apiKey.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {visibility[apiKey.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium">OpenAI Model</Label>
            <Select
              value={settings.OPENAI_MODEL || "gpt-4o-mini"}
              onValueChange={(v) => updateSetting("OPENAI_MODEL", v)}
            >
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select one model" />
              </SelectTrigger>
              <SelectContent>
                {OPENAI_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-8"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
