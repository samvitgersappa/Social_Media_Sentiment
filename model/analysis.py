import sys
import json
from transformers import pipeline

sentiment_analysis = pipeline("sentiment-analysis")


def analyze_sentiment(text):
    result = sentiment_analysis(text)
    return result


if __name__ == "__main__":
    text = sys.argv[1]
    sentiment = analyze_sentiment(text)
    print(json.dumps(sentiment))
