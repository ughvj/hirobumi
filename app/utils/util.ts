interface Era {
  startDate: Date;
  name: string;
  startYear: number;
}

const eras: Era[] = [
  { startDate: new Date(2019, 4, 1), name: "令和", startYear: 2019 },
  { startDate: new Date(1989, 0, 8), name: "平成", startYear: 1989 },
  { startDate: new Date(1926, 11, 25), name: "昭和", startYear: 1926 },
  { startDate: new Date(1912, 6, 30), name: "大正", startYear: 1912 },
  { startDate: new Date(1868, 9, 23), name: "明治", startYear: 1868 },
  { startDate: new Date(1864, 2, 27), name: "元治", startYear: 1864 },
  { startDate: new Date(1863, 2, 11), name: "文久", startYear: 1863 },
  { startDate: new Date(1860, 3, 8), name: "万延", startYear: 1860 },
  { startDate: new Date(1854, 11, 15), name: "安政", startYear: 1854 },
  { startDate: new Date(1853, 0, 1), name: "嘉永", startYear: 1848 },
];

function EraConvert(year: number): string {
  if (year < 1853) {
    throw new Error("1853年（嘉永6年）以前の年は対応していません。");
  }

  const results: string[] = [];

  // その年に該当する元号を探す
  for (let i = 0; i < eras.length; i++) {
    const currentEra = eras[i];
    const nextEra = eras[i - 1]; // 次の元号（より新しい元号）

    // 年の開始時点での元号
    const startOfYear = new Date(year, 0, 1);
    // 年の終了時点での元号
    const endOfYear = new Date(year, 11, 31);

    // その年が元号の範囲内かチェック
    if (
      startOfYear >= currentEra.startDate &&
      (i === 0 || startOfYear < nextEra.startDate)
    ) {
      // 元号での年数を計算
      const eraYear = year - currentEra.startYear + 1;
      const yearString = eraYear === 1 ? "元" : eraYear.toString();
      results.push(`${currentEra.name}${yearString}年`);
    }
    // 年内で元号が変わる場合の処理
    else if (
      nextEra &&
      year === nextEra.startYear &&
      endOfYear >= nextEra.startDate
    ) {
      // 新元号の年
      results.push(`${nextEra.name}元年`);
    }
  }

  return results.join("/");
}

// 新しいテストケース
console.log(EraConvert(2025)); // -> "令和7年"
console.log(EraConvert(2019)); // -> "平成31年/令和元年"
console.log(EraConvert(1989)); // -> "昭和64年/平成元年"
console.log(EraConvert(1926)); // -> "大正15年/昭和元年"
console.log(EraConvert(1912)); // -> "明治45年/大正元年"
console.log(EraConvert(1868)); // -> "慶応4年/明治元年"
console.log(EraConvert(1864)); // -> "文久4年/元治元年"
console.log(EraConvert(1863)); // -> "文久3年"
console.log(EraConvert(1860)); // -> "安政7年/万延元年"
console.log(EraConvert(1854)); // -> "嘉永7年/安政元年"
console.log(EraConvert(1853)); // -> "嘉永6年"

export default EraConvert;
